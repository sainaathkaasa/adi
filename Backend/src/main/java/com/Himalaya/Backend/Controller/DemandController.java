package com.Himalaya.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Himalaya.Backend.Entity.DemandForcasting;
import com.Himalaya.Backend.Service.DemandService;

@RestController
@CrossOrigin(origins = "http://10.64.36.13:5000")
@RequestMapping("/data")
public class DemandController 
{
    @Autowired
	private DemandService demandService ;
	
    @GetMapping
    public Page<DemandForcasting> getAllData(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) 
    {
        Pageable pageable = PageRequest.of(page, size);
        return demandService.getAllData(pageable);
    }
    
    @GetMapping("/getById/{id}")
    public DemandForcasting getById(@PathVariable Long id)
    {
    	return demandService.getById(id);
    }
    
    @GetMapping("/getByname")
    public List<DemandForcasting> getByName(@RequestParam String name)
    {
    	System.out.println(name);
    	return demandService.findByName(name);
    }
    
    @GetMapping("/getByCategory")
    public List<DemandForcasting> findByCategory(@RequestParam Float category)
    {
    	return demandService.findByCategory(category);
    }
    
    @GetMapping("/range")
    public List<DemandForcasting> getByRange(
            @RequestParam("startId") Long startId,
            @RequestParam("endId") Long endId) {
        return demandService.getByRange(startId, endId);
    }
}
