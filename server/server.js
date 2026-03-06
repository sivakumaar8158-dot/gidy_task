import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import UserProfile from './models/UserProfile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});


app.get('/api/profile', async (req, res) => {
    try {
        let profile = await UserProfile.findOne();
        if (!profile) {
            profile = await UserProfile.create({});
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.put('/api/profile', async (req, res) => {
    try {
        const { name, email, bio, skills, workExperience, education, certifications } = req.body;
        let profile = await UserProfile.findOne();
        if (!profile) {
            profile = new UserProfile({ name, email, bio, skills, workExperience, education, certifications });
        } else {
            profile.name = name !== undefined ? name : profile.name;
            profile.email = email !== undefined ? email : profile.email;
            profile.bio = bio !== undefined ? bio : profile.bio;
            if (skills) profile.skills = skills;
            if (workExperience) profile.workExperience = workExperience;
            if (education) profile.education = education;
            if (certifications) profile.certifications = certifications;
        }
        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
