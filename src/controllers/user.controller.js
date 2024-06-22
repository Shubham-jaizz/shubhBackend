import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshToken = async (userId) =>{

    const user  = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken, refreshToken};
}

const registerUser = asyncHandler(async(req,res)=>{
   //get user information
   // validation- empty or not
   //check if user already exists
   //check  for the images and avatar
   //upload them into clodinary 
   //create user oject -- create entry in db
   //remove password and reresh token
   // check for user creation
   // return user


   const {fullName,email,username,password} = req.body
   
    console.log(req.body);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;



    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) => {

    // req body
    //username or email
    //find the user
    //password ceck
    // access and refresh token 
    // send cookie

    const {username,email,password} = req.body
    console.log(req.body);
    // console.log(username,email);
    if(!(username || email) ){
        throw new ApiError(400,"email or userName is required")
    }
        const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"Use does not exist")
    }
     
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(404,"password is not correct")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )

})
const logoutUser =  asyncHandler( async (req, res) => {

       await User.findByIdAndUpdate(
             req.user._id,
             {
               $set: {refreshToken:undefined}
             },
             {
                new:true
             }

       )
       const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user LoggedOut"))



})

export {registerUser,
        loginUser,
        logoutUser
}