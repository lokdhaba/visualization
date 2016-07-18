package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 26/05/2016
 *
 */
@Document
public class ColorCodes implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7355847249823207623L;

	@Id
	private String id;
	private String color;
	private String party;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getParty() {
		return party;
	}

	public void setParty(String party) {
		this.party = party;
	}

	@Override
	public String toString() {
		return "ColorCodes [id=" + id + ", color=" + color + ", party=" + party + "]";
	}

	
}
