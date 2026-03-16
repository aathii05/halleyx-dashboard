package com.halleyx.dashborad2.repository;

import com.halleyx.dashborad2.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerOrderRepository
extends JpaRepository<CustomerOrder, Long>{

List<CustomerOrder> findByEmail(String email);

}