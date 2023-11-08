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
        
        // Suponiendo que createdUser contiene el ID del usuario recién creado
        const userId = createdUser.id; // Ajusta esto a la forma en que obtienes el ID
    
        // Construye la URL de redirección con el ID del usuario
        const redirectUrl = `/profile/${userId}`;
        
        // Redirige al usuario a la ruta /profile/:idUser
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
        
        // Obten el ID del usuario autenticado
        const userId = user.id;

        const sessionInfo = (email === "adminCoder@coder.com" && password === "adminCod3r123")
            ? { email, first_name: user.first_name, isAdmin: true }
            : { email, first_name: user.first_name, isAdmin: false };
        req.session.user = sessionInfo;

        // Redirige al usuario a la página de perfil con el ID del usuario
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