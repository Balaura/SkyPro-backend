export default (req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next();
};