package com.Himalaya.Backend.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.Himalaya.Backend.Entity.DemandForcasting;

@Repository
public interface DemandRepository extends JpaRepository<DemandForcasting, Long>
{
    List<DemandForcasting> findByProductCode(String name);
	List<DemandForcasting> findByqty(Float Category);
	@Query("SELECT d FROM DemandForcasting d WHERE d.Id BETWEEN :startId AND :endId")
	List<DemandForcasting> findByRange(@Param("startId") Long startId, @Param("endId") Long endId);
}
