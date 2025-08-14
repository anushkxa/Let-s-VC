const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("../Major Project/models/listing");

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})


app.get("/",(req,res)=>{
    res.send("Hey I am root");
});
app.get("/testing", async (req, res) => {
    try {
        let sampleListing = new Listing({
            title: "Rathore Villa",
            description: "Built on 12 acres of property with swimming pool aside, Great View of Dal Lake",
            price: 3000,
            location: "Jaipur",
            country: "India"
        });

        await sampleListing.save();
        console.log("Saved");

        res.send("Working");
    } catch (err) {
        console.error("Error saving listing:", err);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000,()=>{
    console.log("Port is Listening");
});

