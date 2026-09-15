import express from 'express';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import upload from '../middleware/upload.js'; // ଆପଣଙ୍କ ମଲ୍ଟର୍ କନଫିଗ୍ରେସନ୍

const router = express.Router();

router.route('/')
    .get(getTeamMembers)
    .post(upload.single('profileImage'), addTeamMember); // 'profileImage' ନାଁ ମ୍ୟାଚ୍ କରିବା ଜରୁରୀ

router.route('/:id')
    .put(upload.single('profileImage'), updateTeamMember)
    .delete(deleteTeamMember);

export default router;