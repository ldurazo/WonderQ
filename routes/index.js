import express from "express";

const router = express.Router();

/* GET home */
router.get('/', (req, res) => {
    res.json({message: "hi"})
});

export default router
