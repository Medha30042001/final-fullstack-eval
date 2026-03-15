import supabase from "../config/supabaseClient.js"
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
 try {

    const {name, email, password} = req.body;

    //verify req.body
    if(!name?.trim() || !email?.trim() || !password?.trim()) {return res.status(400).json({error : 'Name, email and password are required'});}
    if(password.length < 6){return res.status(400).json({error : 'Password must be at least 6 characters'})}

    //check if user already exists
    const {data : exsitingUser, error:checkError} = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .maybeSingle();

    if(checkError){return res.status(500).json({error : checkError.message});}
    if(exsitingUser){return res.status(400).json({error : 'Email already exists'});}

    const password_hash = await bcrypt.hash(password, 10);

    //register user
    const {data:newUser, error} = await supabase
        .from('users')
        .insert([{name, email, password: password_hash}])
        .select()
        .single();

    if(error){return res.status(500).json({error : error.message});}

    //generate token
    const token = generateToken(newUser);

    return res.status(201).json({
        message : 'Signup successful',
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            balance: newUser.balance
            }
    });

 } catch (error) {
    return res.status(500).json({error : error.message});
 }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email?.trim() || !password?.trim()){return res.status(400).json({error : 'Email and password are required'});}

        const {data : user, error} = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .maybeSingle();

        if(error){return res.status(500).json({error : error.message});}
        if(!user){return res.status(400).json({error : 'Invalid Credentials'});}

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){return res.status(400).json({error : 'Invalid credentials'});}

        const token = generateToken(user);

        return res.status(200).json({
            message : 'Login successful',
            token,
            user : {
                id : user.id,
                name : user.name,
                email : user.email
            }
        });
        
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}