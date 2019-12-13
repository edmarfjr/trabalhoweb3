
 
module.exports = async (req, res) => {
    var id = req.params.id;
    res.render("postjson",{id});
    
}