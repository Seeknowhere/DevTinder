const adminAuth = (req,res,next) => {
    console.log("admin authorization is checked!")
    const token = 'xyz';
    const isAuthorized = token === 'xyz';

    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
}

const userAuth = (req,res,next) => {
    console.log("user authorization is checked!")
    const token = 'xyz';
    const isAuthorized = token === 'xyz';

    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
}
module.exports = {
    adminAuth,
    userAuth
}