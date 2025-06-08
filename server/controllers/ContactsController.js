const { default: mongoose } = require("mongoose");
const { User } = require("../models/User");
const { Message } = require("../models/Message");

exports.searchContacts = async (req, res) => {

    const { searchTerm } = req.body;
    try {
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("searchTerm is required.");
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ]
                }
            ]
        }).select("-password");

        res.status(200).json({ contacts });

        // return res.status(200).send("Logout successfull.");
    } catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
    }

}

exports.getDmContactList = async (req, res) => {
    try {
        let { userId } = req.query;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: { $or: [{ sender: userId }, { receiver: userId }] }
            },
            {
                $sort: { timestamp: -1 } // latest on the top
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receiver",
                            else: "$sender"
                        },
                    },
                    lastMessage: { $first: "$timestamp" },

                }
            },
            {
                $lookup: {
                    from: "users",              // The collection you're joining with
                    localField: "_id",          // The field in your current data (contact's ID)
                    foreignField: "_id",        // The matching field in the 'users' collection
                    as: "contactInfo"           // The result will go into a new field named 'contactInfo'
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    color: "$contactInfo.color",
                    profileImage: "$contactInfo.profileImage",
                    profileSetup: "$contactInfo.profileSetup"
                }
            },
            {
                $sort: { lastMessage: 1 }
            }]
        );

        res.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
    }
}