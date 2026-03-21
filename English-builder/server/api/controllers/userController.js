import User from "../models/User.js";
export const getMe = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
        .select("-password")

        res.status(200).json(user)

    } catch (error) {

        res.status(500).json({ message: "Server error" })

    }

};
export const updateMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username },
        { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Update profile failed" });
    }
};