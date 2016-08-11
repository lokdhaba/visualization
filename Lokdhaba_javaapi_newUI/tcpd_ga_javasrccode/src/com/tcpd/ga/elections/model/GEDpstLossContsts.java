package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 26/05/2016
 *
 */
@Document
public class GEDpstLossContsts implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1022151884218121668L;

	@Id
	@JsonIgnore
	private String id;
	private int deposit_saved;
	private int total_candidates;
	private int year;
	@JsonIgnore
	private int ga_no;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getDeposit_saved() {
		return deposit_saved;
	}

	public void setDeposit_saved(int deposit_saved) {
		this.deposit_saved = deposit_saved;
	}

	public int getTotal_candidates() {
		return total_candidates;
	}

	public void setTotal_candidates(int total_candidates) {
		this.total_candidates = total_candidates;
	}

	public int getGa_no() {
		return ga_no;
	}
	public void setGa_no(int ga_no) {
		this.ga_no = ga_no;
	}
	
	public String getYear() {
		return year + "#" + ga_no;
	}

	public void setYear(int year) {
		this.year = year;
	}

	@Override
	public String toString() {
		return "GEDpstLossContsts [id=" + id + ", deposit_saved=" + deposit_saved + ", total_candidates="
				+ total_candidates + ", year=" + year + "]";
	}

	
}
