package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 04/05/2016
 *
 */

@Document
public class AEMaps implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -5746908203751255661L;

	@Id
	private String id;
	private String ac_name;
	private int ac_no;
	private String ac_type;
	private String cand1;
	private int electors;
	private int margin;
	private Double margin_percent;
	private String n_cand;
	private String nota_percent;
	private String party1;
	private int position;
	private String religion;
	private String runner;
	private String runner_party;
	private String runner_sex;
	private String sex1;
	private String state;
	private Double turnout;
	private Double vote_percent;
	private int voters;
	private int votes1;
	private int year;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAc_name() {
		return ac_name;
	}
	public void setAc_name(String ac_name) {
		this.ac_name = ac_name;
	}
	public int getAc_no() {
		return ac_no;
	}
	public void setAc_no(int ac_no) {
		this.ac_no = ac_no;
	}
	public String getAc_type() {
		return ac_type;
	}
	public void setAc_type(String ac_type) {
		this.ac_type = ac_type;
	}
	public String getCand1() {
		return cand1;
	}
	public void setCand1(String cand1) {
		this.cand1 = cand1;
	}
	public int getElectors() {
		return electors;
	}
	public void setElectors(int electors) {
		this.electors = electors;
	}
	public int getMargin() {
		return margin;
	}
	public void setMargin(int margin) {
		this.margin = margin;
	}
	public Double getMargin_percent() {
		return margin_percent;
	}
	public void setMargin_percent(Double margin_percent) {
		this.margin_percent = margin_percent;
	}
	public String getN_cand() {
		return n_cand;
	}
	public void setN_cand(String n_cand) {
		this.n_cand = n_cand;
	}
	public String getNota_percent() {
		return nota_percent;
	}
	public void setNota_percent(String nota_percent) {
		this.nota_percent = nota_percent;
	}
	public String getParty1() {
		return party1;
	}
	public void setParty1(String party1) {
		this.party1 = party1;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public String getReligion() {
		return religion;
	}
	public void setReligion(String religion) {
		this.religion = religion;
	}
	public String getRunner() {
		return runner;
	}
	public void setRunner(String runner) {
		this.runner = runner;
	}
	public String getRunner_party() {
		return runner_party;
	}
	public void setRunner_party(String runner_party) {
		this.runner_party = runner_party;
	}
	public String getRunner_sex() {
		return runner_sex;
	}
	public void setRunner_sex(String runner_sex) {
		this.runner_sex = runner_sex;
	}
	public String getSex1() {
		return sex1;
	}
	public void setSex1(String sex1) {
		this.sex1 = sex1;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public Double getTurnout() {
		return turnout;
	}
	public void setTurnout(Double turnout) {
		this.turnout = turnout;
	}
	public Double getVote_percent() {
		return vote_percent;
	}
	public void setVote_percent(Double vote_percent) {
		this.vote_percent = vote_percent;
	}
	public int getVoters() {
		return voters;
	}
	public void setVoters(int voters) {
		this.voters = voters;
	}
	public int getVotes1() {
		return votes1;
	}
	public void setVotes1(int votes1) {
		this.votes1 = votes1;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	@Override
	public String toString() {
		return "AEMaps [id=" + id + ", ac_name=" + ac_name + ", ac_no=" + ac_no + ", ac_type=" + ac_type + ", cand1="
				+ cand1 + ", electors=" + electors + ", margin=" + margin + ", margin_percent=" + margin_percent
				+ ", n_cand=" + n_cand + ", nota_percent=" + nota_percent + ", party1=" + party1 + ", position="
				+ position + ", religion=" + religion + ", runner=" + runner + ", runner_party=" + runner_party
				+ ", runner_sex=" + runner_sex + ", sex1=" + sex1 + ", state=" + state + ", turnout=" + turnout
				+ ", vote_percent=" + vote_percent + ", voters=" + voters + ", votes1=" + votes1 + ", year=" + year
				+ "]";
	}
	
}
