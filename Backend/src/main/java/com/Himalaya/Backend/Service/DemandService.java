package com.Himalaya.Backend.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.Himalaya.Backend.Entity.DemandForcasting;
import com.Himalaya.Backend.Repository.DemandRepository;

@Service
public class DemandService 
{
    @Autowired
    private DemandRepository demandRepository;

    public Page<DemandForcasting> getAllData(Pageable pageable)
	{
		return demandRepository.findAll(pageable);
	}
	
	public DemandForcasting getById(Long id)
	{
		Optional<DemandForcasting> optionalDemand = demandRepository.findById(id);
		return optionalDemand.get();
	}
	
	public List<DemandForcasting> findByName(String name)
	{
		return demandRepository.findByProductCode(name);
	}
	
	public List<DemandForcasting> findByCategory(Float category)
	{
		return demandRepository.findByqty(category);
	}
	
	public List<DemandForcasting> getByRange(Long startId, Long endId) {
        return demandRepository.findByRange(startId, endId);
    }
}
