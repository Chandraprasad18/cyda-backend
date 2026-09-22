import jwt from 'jsonwebtoken';

export const verifySuperAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is superadmin
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied! Only Super Admin can perform this action.' });
    }

    req.admin = decoded; // କିମ୍ବା req.user = decoded; (ଯାହା ଇଚ୍ଛା ରଖିପାରିବେ)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};