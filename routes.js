const router = require("express").Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const PATH = "./API/blog.json"


// GET in order to return all
router.get("/all",(req,res)=>{
    let blogArray = read();
    res.json({message: "Success", blog: blogArray });
});

router.get("/get-id/:post_id", (req, res)=>{
    try {
        const url = (req.params.post_id);
        console.log(url);
        let blogArray = read();
        console.log(blogArray);
        let blog = blogArray.findIndex((blogObject)=> blogObject.post_id == req.params.post_id);
        console.log(blog);
        if(!blog){
            throw new Error("Blog Not Found");
        } 
        res.json({message: "Blog by id found", blogPost: blogArray[blog]});  
    } catch(err){
        res.status(500).json({
            message: "error",
            errorMessage: err.message
        })
    }

});

router.post("/add", (req,res)=>{
    const {post_id, title, author, body} = req.body
    let blogArray = read();
    let newBlog = {
        post_id: uuidv4(),
        title: title,
        author: author,
        body: body,
    };
    blogArray.push(newBlog);
    save(blogArray);
    res.json({message: "New blog content added",
    blog : blogArray,
    recordCount: blogArray.length,});
    
});

router.patch("/update/:id", (req, res)=>{
    try {
        const id = req.params.id
        console.log(id);
        let blogArray = read();

        let blogIndex = blogArray.findIndex((blogObject)=>blogObject.post_id == id);
        if(blogIndex == -1) throw new Error("Blog not found");

        let newObject = req.body;
        let originalObject = blogArray[blogIndex]

        blogArray[blogIndex] = {...originalObject, ...newObject};

        save(blogArray);

        res.json({
            message: "Success Updated"
        })

    } catch (error) {
        res.status(500).json({message: "error",errorMessage: error.message});
        
    }
});

router.delete("/delete/:post_id", (req, res)=>{
    try {
        console.log(req.params.post_id);
        let blogArray = read();

        let filteredBlogArray = blogArray.filter(
            (blogObject) => blogObject.post_id != req.params.post_id
        );

        if(blogArray.length == filteredBlogArray.length){
            throw new Error ("Job Not Found")
        }

        res.json({
            message: "blog deleted",
            blog: filteredBlogArray,
            recordCount: filteredBlogArray.length,
        });
        save(filteredBlogArray);

    } catch (error) {
        res.status(500).json({message: "error", errorMessage: error.message})
    }
});

// function to read file
function read (){
    const file = fs.readFileSync(PATH);
    return JSON.parse(file);
}
// function to save 
function save (data) {
    const file = fs.writeFileSync(PATH,JSON.stringify(data));
}

module.exports = router;