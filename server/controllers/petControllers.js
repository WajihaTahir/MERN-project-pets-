import PetModel from "../models/petModel.js"

const getAllPets = async (req, res) =>{
try {
    const allPets = await PetModel.find().populate({path:"owner", select:"username",});
    res.status(200).json({
        number:allPets.length,
        allPets
    })
} catch (error) {
    console.log("error:", error);
    res.status(500).json({error:"Something went wrong"})
}
}

export {getAllPets} ;