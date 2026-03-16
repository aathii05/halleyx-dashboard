package com.halleyx.dashborad2.controller;

import com.halleyx.dashborad2.model.CustomerOrder;
import com.halleyx.dashborad2.repository.CustomerOrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class CustomerOrderController {

    @Autowired
    private CustomerOrderRepository repository;

    // CREATE ORDER
    @PostMapping
    public CustomerOrder createOrder(@RequestBody CustomerOrder order) {

        order.setTotalAmount(order.getQuantity() * order.getUnitPrice());
        order.setStatus("PENDING");

        return repository.save(order);
    }

    // GET ALL ORDERS
    @GetMapping
    public List<CustomerOrder> getAllOrders() {

        return repository.findAll();
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {

        repository.deleteById(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status/{status}")
    public CustomerOrder updateStatus(
            @PathVariable Long id,
            @PathVariable String status) {

        CustomerOrder order = repository.findById(id).orElseThrow();

        order.setStatus(status);

        return repository.save(order);
    }

    // DASHBOARD STATS
    @GetMapping("/stats")
    public Map<String, Object> getStats(){

        List<CustomerOrder> orders = repository.findAll();

        double revenue = orders.stream()
                .mapToDouble(CustomerOrder::getTotalAmount)
                .sum();

        Map<String,Object> stats = new HashMap<>();

        stats.put("totalOrders", orders.size());
        stats.put("totalRevenue", revenue);

        return stats;
    }

    // CUSTOMER TRACK ORDER
    @GetMapping("/track")
    public List<CustomerOrder> trackOrder(@RequestParam String email){

        return repository.findByEmail(email);
    }

}