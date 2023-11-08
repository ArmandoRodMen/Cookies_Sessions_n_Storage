import { Router } from "express";
import { usersManager } from "../DAO/mongodb/managers/usersManager.js";

const router = Router();

router.post("/signup", async (req, res) => {
        const { first_name, last_name, email, password, username } = req.body;
        
        if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ message: "Some data is missing" });
        }
        try {
        const createdUser = await usersManager.createOne(req.body);
        const userId = createdUser.id; 
        const redirectUrl = `/profile/${userId}`;
        res.redirect(redirectUrl);
        } catch (error) {
        res.status(500).json({ error });
        }
    });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return res.redirect("/signup");
        }
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is not valid" });
        }
        const userId = user.id;
        console.log("userId", userId);
        const sessionInfo = (email === "adminCoder@coder.com" && password === "adminCod3r123")
            ? { email, first_name: user.first_name, isAdmin: true, isUser: false, userId}
            : { email, first_name: user.first_name, isAdmin: false, isUser: true, userId };
        req.session.user = sessionInfo;
        res.redirect(`/profile/${userId}`);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.get("/signout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
});

export default router;