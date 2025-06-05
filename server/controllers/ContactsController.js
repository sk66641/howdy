const { User } = require("../models/User");

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