const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { restart } = require("nodemon");
const _ = require("lodash");

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

// step 1
mongoose.connect("mongodb://localhost:27017/todolistDB");


// step 2

const itemSchema = {
    name: String
};

// step 3

const Item = mongoose.model("Item",itemSchema);

// step 4

const item1 = new Item ({
    name : "Welcome to your todolist!"
});

const item2 = new Item ({
    name : "Hit the + button to add a new item."
});
const item3 = new Item ({
    name : "<--- Hit this to delete an item."
});

// step 5

const defaltItems = [item1,item2, item3];


// STEP 14
const listSchema = {
    name : String,
    items :[itemSchema]
};

// STEP 15
const List = mongoose.model("List",listSchema);



// step 6

// Item.insertMany(defaltItems,function(err){
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log.apply("Successfully saved the deaflat items to database")
//     }
// })



app.get("/", function(req,res){

    // step 7
    Item.find({}, function(err,foundItems){

        // step 9 so that the too many items doesn't get inserted into 
        // the db

        if (foundItems.length === 0){

            Item.insertMany(defaltItems,function(err){
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully saved the deaflat items to database")
                }
            })
        } else{
        res.render("list",{listTitle: "Today", newListItems:foundItems });
        }
    });

    // step 8 in list.ejs

//     var today = new Date();
//     var day ="";
    
//     // you can use switch statement as in 
//     // switch(today.getDay())
//    var options = {
//     weekday : "long",
//     day: "numeric",
//     month : "long"
//    };


//  var day = today.toLocaleDateString("en-US", options)
});

// STEP 13
app.get("/:customListName",function(req,res){
  const customListName =_.capitalize(req.params.customListName);

//   STEP 17 checks if the url we typep exists in the list
   List.findOne({name : customListName},function(err,foundList){
    if(!err){
        if(!foundList){
            // create a new list
            const list = new List({
                name : customListName,
                items : defaltItems
               });
               list.save();
               res.redirect("/" + customListName);
        }
        else{
            // show an existing list
            res.render("list",{listTitle: foundList.name, newListItems:foundList.items });
            
        }
    }
   })

//   STEP 16
//    const list = new List({
//     name : customListName,
//     items : defaltItems
//    });
// list.save()
});

app.post("/",function(req,res){
    // step 10 (the app crashes when the + button is pressed to solve the error)

    const itemName = req.body.newItem;
    // STEP 18 :SECOND PROCESS
    const listName = req.body.list;


    
    // we create a new document in step 10
    // this step consoles the item we add by + button in the mongo shell
    const item = new Item({
        name : itemName
    });
      
    // STEP 18 THIRD PROCESS
    // if the user came from the custom list then we redirect the user to the same
    // custom list
    if (listName === "Today"){
        item.save();
        res.redirect("/")
    }
    else {
        List.findOne ({name:listName}, function (err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+ listName);
        })
    }


    // item.save();

    // step 11 [In order that the new added shows in the list we redirect it]
    // res.redirect("/")
    // step 12 in list.ejs
})

// step 12 second process
app.post("/delete",function(req,res){
   const deleteItem = req.body.checkbox;
//    STEP 19 [first process in list.ejs] SECOND PROCESS 
   const listName = req.body.listName;

   if (listName === "Today"){
    Item.findByIdAndRemove(deleteItem, function(err){
            if (err){
                console.log(err);
            }
            else {
                console.log("Successfully deleted the item")
                res.redirect("/");
            }
        })
   }else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:deleteItem}}},function(err,foundList){
        if(!err){
            res.redirect("/"+listName);
        }
    })
   }

//    step 12 fourth process : refer to the list.ejs in which the value is 
// declared for the input type checkbox which returns the id of the item ... 
// then pass on the value to the findByIdAndRemove function 


    // Item.findByIdAndRemove(deleteItem, function(err){
    //     if (err){
    //         console.log(err);
    //     }
    //     else {
    //         console.log("Successfully deleted the item")
    //     }
    // })
   

})

// step 12 third process in list.ejs


app.get("/work", function(req,res){
    res.render("list", {listTitle:"Work List",newListItems:workItems })
});
app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect('/work');

})

app.get("/about",function(req,res){
res.render("about");

})
app.listen(3000, function(){
    console.log("Server started on port 3000");
})




