package com.halleyx.dashborad2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer_orders")
public class CustomerOrder {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(name="first_name")
private String firstName;

@Column(name="last_name")
private String lastName;

private String email;

private String product;

private int quantity;

@Column(name="unit_price")
private double unitPrice;

@Column(name="total_amount")
private double totalAmount;

private String status;

public CustomerOrder(){}

public Long getId(){ return id; }

public String getFirstName(){ return firstName; }
public void setFirstName(String firstName){ this.firstName = firstName; }

public String getLastName(){ return lastName; }
public void setLastName(String lastName){ this.lastName = lastName; }

public String getEmail(){ return email; }
public void setEmail(String email){ this.email = email; }

public String getProduct(){ return product; }
public void setProduct(String product){ this.product = product; }

public int getQuantity(){ return quantity; }
public void setQuantity(int quantity){ this.quantity = quantity; }

public double getUnitPrice(){ return unitPrice; }
public void setUnitPrice(double unitPrice){ this.unitPrice = unitPrice; }

public double getTotalAmount(){ return totalAmount; }
public void setTotalAmount(double totalAmount){ this.totalAmount = totalAmount; }

public String getStatus(){ return status; }
public void setStatus(String status){ this.status = status; }

}