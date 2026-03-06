import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Thanushree Vijayakanth'
    },
    email: {
        type: String,
        required: true,
        default: 'thanushree1866@gmail.com'
    },
    bio: {
        type: String,
        default: 'Career goals have not been added yet.'
    },
    skills: {
        type: Array,
        default: [
            { name: 'React.js', endorsements: 24, endorsedByMe: false },
            { name: 'Tailwind CSS', endorsements: 18, endorsedByMe: true },
            { name: 'JavaScript (ES6+)', endorsements: 15, endorsedByMe: false },
            { name: 'UI/UX Design', endorsements: 12, endorsedByMe: false },
            { name: 'Node.js', endorsements: 9, endorsedByMe: false },
            { name: 'Vite', endorsements: 7, endorsedByMe: false },
        ]
    },
    workExperience: {
        type: Array,
        default: [
            { id: 1, role: 'Frontend Engineer', company: 'TechNova', period: '2023 - Present', desc: 'Leading UI development for the core product using React, Vite, and Tailwind CSS. Mentoring junior developers and establishing UI component standards.' },
            { id: 2, role: 'UI/UX Designer', company: 'Creative Solutions', period: '2021 - 2023', desc: 'Designed intuitive user interfaces and established design systems in Figma. Collaborated tightly with engineering to bridge the gap between design and code.' },
            { id: 3, role: 'Web Developer Intern', company: 'StartUp Inc', period: '2020 - 2021', desc: 'Maintained legacy codebases, improved page load performance by 25%, and implemented new responsive layouts across the site.' }
        ]
    },
    education: {
        type: Array,
        default: [
            { id: 1, institution: 'University of Technology', degree: 'B.Sc. in Computer Science', period: '2016 - 2020' }
        ]
    },
    certifications: {
        type: Array,
        default: [
            { id: 1, name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2022' }
        ]
    }
}, {
    timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
