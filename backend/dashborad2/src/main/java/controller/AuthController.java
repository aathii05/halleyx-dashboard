package com.halleyx.dashborad2.controller;

import com.halleyx.dashborad2.model.User;
import com.halleyx.dashborad2.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

@Autowired
private UserRepository repo;

@PostMapping("/login")
public User login(@RequestBody User user){

Optional<User> dbUser = repo.findByUsername(user.getUsername());

if(dbUser.isPresent() &&
dbUser.get().getPassword().equals(user.getPassword())){

return dbUser.get();

}

throw new RuntimeException("Invalid login");

}

}