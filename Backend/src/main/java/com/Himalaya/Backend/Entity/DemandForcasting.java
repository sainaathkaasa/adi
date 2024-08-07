package com.Himalaya.Backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "DemandForcasting")
public class DemandForcasting {
    @jakarta.persistence.Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id ;
	
	@Column(name = "CFACode")
	private String CFACode ;
	
	@Column(name = "ProductCode")
	private String productCode ;
	
	@Column(name = "Week_Start_Date")
	private String Week_Start_Date ;
	
	@Column(name = "Qty")
	private Float qty ;
	
	@Column(name = "Category")
	private String Category ;
	
	@Column(name = "CFAPINCODE")
	private String CFAPINCODE ;
	
	@Column(name = "Predicted_Qty")
	private String Predicted_Qty ;

	public Long getId() 
	{
		return Id;
	}

	public void setId(Long id) 
	{
		Id = id;
	}

	public String getCFACode() 
	{
		return CFACode;
	}

	public void setCFACode(String CFACode) 
	{
		this.CFACode = CFACode;
	}

	public String getProductCode() 
	{
		return productCode;
	}

	public void setProductCode(String productCode) 
	{
		this.productCode = productCode;
	}

	public String getWeek_Start_Date() 
	{
		return Week_Start_Date;
	}

	public void setWeek_Start_Date(String Week_Start_Date) 
	{
		this.Week_Start_Date = Week_Start_Date;
	}

	public Float getQty() 
	{
		return qty;
	}

	public void setQty(Float qty) 
	{
		this.qty = qty;
	}

	public String getCategory() 
	{
		return Category;
	}

	public void setCategory(String Category) 
	{
		this.Category = Category;
	}

	public String getCFAPINCODE() 
	{
		return CFAPINCODE;
	}

	public void setCFAPINCODE(String cFAPINCODE) 
	{
		CFAPINCODE = cFAPINCODE;
	}

	public String getPredicted_Qty() 
	{
		return Predicted_Qty;
	}

	public void setPredicted_Qty(String predicted_Qty) 
	{
		Predicted_Qty = predicted_Qty;
	}
}
