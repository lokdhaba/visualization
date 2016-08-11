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
public class GEMaps implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8218592667401998767L;

	@Id
	private String id;
	private String cand1;
	private String cand_type;
	private String caste_rec;
	private String contested;
	private int electors;
	private Double enop_vot;
	private String female_electors;
	private String female_turnout;
	private String female_voters;
	private String first_election;
	private String incumbent;
	private String jati;
	private String male_electors;
	private String male_turnout;
	private String male_voters;
	private int margin;
	private int n_cand;
	private String party1;
	private String party_dup;
	private String party_type;
	private String pc_name;
	private String pc_name1;
	private int pc_no;
	private String pc_pdf;
	private String pc_type;
	private Double percent1;
	private String phase;
	private String poll_date;
	private String poll_month;
	private int position;
	private String postal_voters;
	private String rel;
	private int serial_no;
	private String sex1;
	private String state_name;
	private String sub_region;
	private Double turnout;
	private String urban_percent;
	private String urban_type;
	private String valid_votes;
	private int voters;
	private int votes1;
	private String votes_rejected;
	private int year;
	private int ga_no;
	private int year_dup;
	private String yob;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCand1() {
		return cand1;
	}

	public void setCand1(String cand1) {
		this.cand1 = cand1;
	}

	public String getCand_type() {
		return cand_type;
	}

	public void setCand_type(String cand_type) {
		this.cand_type = cand_type;
	}

	public String getCaste_rec() {
		return caste_rec;
	}

	public void setCaste_rec(String caste_rec) {
		this.caste_rec = caste_rec;
	}

	public String getContested() {
		return contested;
	}

	public void setContested(String contested) {
		this.contested = contested;
	}

	public int getElectors() {
		return electors;
	}

	public void setElectors(int electors) {
		this.electors = electors;
	}

	public Double getEnop_vot() {
		return enop_vot;
	}

	public void setEnop_vot(Double enop_vot) {
		this.enop_vot = enop_vot;
	}

	public String getFemale_electors() {
		return female_electors;
	}

	public void setFemale_electors(String female_electors) {
		this.female_electors = female_electors;
	}

	public String getFemale_turnout() {
		return female_turnout;
	}

	public void setFemale_turnout(String female_turnout) {
		this.female_turnout = female_turnout;
	}

	public String getFemale_voters() {
		return female_voters;
	}

	public void setFemale_voters(String female_voters) {
		this.female_voters = female_voters;
	}

	public String getFirst_election() {
		return first_election;
	}

	public void setFirst_election(String first_election) {
		this.first_election = first_election;
	}

	public String getIncumbent() {
		return incumbent;
	}

	public void setIncumbent(String incumbent) {
		this.incumbent = incumbent;
	}

	public String getJati() {
		return jati;
	}

	public void setJati(String jati) {
		this.jati = jati;
	}

	public String getMale_electors() {
		return male_electors;
	}

	public void setMale_electors(String male_electors) {
		this.male_electors = male_electors;
	}

	public String getMale_turnout() {
		return male_turnout;
	}

	public void setMale_turnout(String male_turnout) {
		this.male_turnout = male_turnout;
	}

	public String getMale_voters() {
		return male_voters;
	}

	public void setMale_voters(String male_voters) {
		this.male_voters = male_voters;
	}

	public int getMargin() {
		return margin;
	}

	public void setMargin(int margin) {
		this.margin = margin;
	}

	public int getN_cand() {
		return n_cand;
	}

	public void setN_cand(int n_cand) {
		this.n_cand = n_cand;
	}

	public String getParty1() {
		return party1;
	}

	public void setParty1(String party1) {
		this.party1 = party1;
	}

	public String getParty_dup() {
		return party_dup;
	}

	public void setParty_dup(String party_dup) {
		this.party_dup = party_dup;
	}

	public String getParty_type() {
		return party_type;
	}

	public void setParty_type(String party_type) {
		this.party_type = party_type;
	}

	public String getPc_name() {
		return pc_name;
	}

	public void setPc_name(String pc_name) {
		this.pc_name = pc_name;
	}

	public String getPc_name1() {
		return pc_name1;
	}

	public void setPc_name1(String pc_name1) {
		this.pc_name1 = pc_name1;
	}

	public int getPc_no() {
		return pc_no;
	}

	public void setPc_no(int pc_no) {
		this.pc_no = pc_no;
	}

	public String getPc_pdf() {
		return pc_pdf;
	}

	public void setPc_pdf(String pc_pdf) {
		this.pc_pdf = pc_pdf;
	}

	public String getPc_type() {
		return pc_type;
	}

	public void setPc_type(String pc_type) {
		this.pc_type = pc_type;
	}

	public Double getPercent1() {
		return percent1;
	}

	public void setPercent1(Double percent1) {
		this.percent1 = percent1;
	}

	public String getPhase() {
		return phase;
	}

	public void setPhase(String phase) {
		this.phase = phase;
	}

	public String getPoll_date() {
		return poll_date;
	}

	public void setPoll_date(String poll_date) {
		this.poll_date = poll_date;
	}

	public String getPoll_month() {
		return poll_month;
	}

	public void setPoll_month(String poll_month) {
		this.poll_month = poll_month;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public String getPostal_voters() {
		return postal_voters;
	}

	public void setPostal_voters(String postal_voters) {
		this.postal_voters = postal_voters;
	}

	public String getRel() {
		return rel;
	}

	public void setRel(String rel) {
		this.rel = rel;
	}

	public int getSerial_no() {
		return serial_no;
	}

	public void setSerial_no(int serial_no) {
		this.serial_no = serial_no;
	}

	public String getSex1() {
		return sex1;
	}

	public void setSex1(String sex1) {
		this.sex1 = sex1;
	}

	public String getState_name() {
		return state_name;
	}

	public void setState_name(String state_name) {
		this.state_name = state_name;
	}

	public String getSub_region() {
		return sub_region;
	}

	public void setSub_region(String sub_region) {
		this.sub_region = sub_region;
	}

	public Double getTurnout() {
		return turnout;
	}

	public void setTurnout(Double turnout) {
		this.turnout = turnout;
	}

	public String getUrban_percent() {
		return urban_percent;
	}

	public void setUrban_percent(String urban_percent) {
		this.urban_percent = urban_percent;
	}

	public String getUrban_type() {
		return urban_type;
	}

	public void setUrban_type(String urban_type) {
		this.urban_type = urban_type;
	}

	public String getValid_votes() {
		return valid_votes;
	}

	public void setValid_votes(String valid_votes) {
		this.valid_votes = valid_votes;
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

	public String getVotes_rejected() {
		return votes_rejected;
	}

	public void setVotes_rejected(String votes_rejected) {
		this.votes_rejected = votes_rejected;
	}

	public int getGa_no() {
		return ga_no;
	}
	public void setGa_no(int ga_no) {
		this.ga_no = ga_no;
	}
	
	
	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getYear_dup() {
		return year_dup;
	}

	public void setYear_dup(int year_dup) {
		this.year_dup = year_dup;
	}

	public String getYob() {
		return yob;
	}

	public void setYob(String yob) {
		this.yob = yob;
	}

	@Override
	public String toString() {
		return "GEMaps [id=" + id + ", cand1=" + cand1 + ", cand_type=" + cand_type + ", caste_rec=" + caste_rec
				+ ", contested=" + contested + ", electors=" + electors + ", enop_vot=" + enop_vot
				+ ", female_electors=" + female_electors + ", female_turnout=" + female_turnout + ", female_voters="
				+ female_voters + ", first_election=" + first_election + ", incumbent=" + incumbent + ", jati=" + jati
				+ ", male_electors=" + male_electors + ", male_turnout=" + male_turnout + ", male_voters=" + male_voters
				+ ", margin=" + margin + ", n_cand=" + n_cand + ", party1=" + party1 + ", party_dup=" + party_dup
				+ ", party_type=" + party_type + ", pc_name=" + pc_name + ", pc_name1=" + pc_name1 + ", pc_no=" + pc_no
				+ ", pc_pdf=" + pc_pdf + ", pc_type=" + pc_type + ", percent1=" + percent1 + ", phase=" + phase
				+ ", poll_date=" + poll_date + ", poll_month=" + poll_month + ", position=" + position
				+ ", postal_voters=" + postal_voters + ", rel=" + rel + ", serial_no=" + serial_no + ", sex1=" + sex1
				+ ", state_name=" + state_name + ", sub_region=" + sub_region + ", turnout=" + turnout
				+ ", urban_percent=" + urban_percent + ", urban_type=" + urban_type + ", valid_votes=" + valid_votes
				+ ", voters=" + voters + ", votes1=" + votes1 + ", votes_rejected=" + votes_rejected + ", ga_no=" + ga_no + ", year=" + year
				+ ", year_dup=" + year_dup + ", yob=" + yob + "]";
	}

}
