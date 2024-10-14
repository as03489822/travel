function asyncWrap(fn){
    return function (req ,res ,next){
    fn(req ,res ,next).catch(err => next(err))
    }
}
module.exports = asyncWrap;

//    both are right function to exports

    // module.exports = wrapAsync = (fn) => {
    //     return (req ,res ,next) =>{
    //     fn(req ,res ,next).catch(err => next(err))
    //     }
    // }