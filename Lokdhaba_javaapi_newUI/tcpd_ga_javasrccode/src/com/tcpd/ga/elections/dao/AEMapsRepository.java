package com.tcpd.ga.elections.dao;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.tcpd.ga.elections.model.AEDpstLossContst;
import com.tcpd.ga.elections.model.AEMaps;
import com.tcpd.ga.elections.model.AEPartiesContst;
import com.tcpd.ga.elections.model.AESeatShares;
import com.tcpd.ga.elections.model.AEVoteShares;
import com.tcpd.ga.elections.model.AEVotrTurnouts;
import com.tcpd.ga.elections.model.AEWomens;
import com.mongodb.BasicDBObject;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 04/05/2016
 *
 */

@Repository
public class AEMapsRepository {

	private static final Logger logger = LoggerFactory.getLogger(AEMapsRepository.class);

	// AE related mongodb column names.
	private static final String AE_MAPS = "ae_maps";
	private static final String AE_CONTESTED_DEPOSIT_LOSTS = "ae_contested_deposit_losts";
	private static final String AE_PARTIES_CONTESTS = "ae_parties_contests";
	private static final String AE_SEATSHARES = "ae_seatshares";
	private static final String AE_VOTESHARES = "ae_voteshares";
	private static final String AE_VOTER_TURNOUTS = "ae_voter_turnouts";
	private static final String AE_WOMENS = "ae_womens";
	

	@Autowired
	private MongoTemplate mongoTemplate;

	public List<AEMaps> getAllAEMaps() {
		logger.info(" inside getAllMaps() of AssemblyElectionsRepository class ..");
		return mongoTemplate.findAll(AEMaps.class, AE_MAPS);
	}

	// To get unique states from ae_maps

	@SuppressWarnings("unchecked")
	public List<AEMaps> getUniqueAEMapStates() {
		logger.info(" inside getUniqueAEMapStates() of AssemblyElectionsRepository class ..");
		return mongoTemplate.getCollection(AE_MAPS).distinct("state");
	}

	// To get unique years based on a specific state from ae_maps

	public List<AEMaps> getUniqueAEMapYears(String state) {
		logger.info(" inside getUniqueAEMapYears() of AssemblyElectionsRepository class ..");
		BasicDBObject dbObject = new BasicDBObject();
		dbObject.append("state", state);

		return mongoTemplate.getCollection(AE_MAPS).distinct("year", dbObject);
	}

	// ae_maps- get data for specific state and year

	public List<AEMaps> getAEMapStatsYears(String state, int year) {
		logger.info(" inside getAEMapStatsYears() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(query(where("state").is(state).and("year").is(Integer.valueOf(year))), AEMaps.class,
				AE_MAPS);
	}

	// ae_maps- To get the data for the 'Positon' =:position for specific state
	// and year

	public List<AEMaps> getAEMapPositionsForStatsYears(String state, int year, int position) {
		logger.info(" inside getAEMapPositionsForStatsYears() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(query(where("state").is(state).and("year").is(Integer.valueOf(year)).and("position")
				.is(Integer.valueOf(position))), AEMaps.class, AE_MAPS);
	}

	// ae-maps - To get all unique parties by State, Year

	public List<AEMaps> getUniqueAEMapParties(String state, int year) {
		logger.info(" inside getUniqueAEMapParties() of AssemblyElectionsRepository class ..");
		BasicDBObject dbObject = new BasicDBObject();
		dbObject.append("state", state);
		dbObject.append("year", year);

		return mongoTemplate.getCollection(AE_MAPS).distinct("party1", dbObject);
	}

	// Get all data from ae_contested_deposit_losts

	public List<AEDpstLossContst> findAllAEDpstLossContst(String state) {
		logger.info(" inside AEDpstLossContst() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AEDpstLossContst.class, AE_CONTESTED_DEPOSIT_LOSTS);
	}

	// Get all data from ae_parties_contests

	public List<AEPartiesContst> findAllAEPartiesContst(String state) {
		logger.info(" inside findAllAEPartiesContst() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AEPartiesContst.class, AE_PARTIES_CONTESTS);
	}

	// Get all data from ae_seatshares

	public List<AESeatShares> findAllAESeatShares(String state) {
		logger.info(" inside findAllAESeatShares() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AESeatShares.class, AE_SEATSHARES);
	}

	// Get all data from ae_voteshares

	public List<AEVoteShares> findAllAEVoteShars(String state) {
		logger.info(" inside findAllAEVoteShars() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AEVoteShares.class, AE_VOTESHARES);
	}

	// Get all data from ae_voter_turnouts

	public List<AEVotrTurnouts> findAllAEVtrTurnOuts(String state) {
		logger.info(" inside findAllAEVtrTurnOuts() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AEVotrTurnouts.class, AE_VOTER_TURNOUTS);
	}

	// Get all data from ae_womens

	public List<AEWomens> findAllAEWomens(String state) {
		logger.info(" inside findAllAEWomens() of AssemblyElectionsRepository class ..");
		return mongoTemplate.find(query(where("state").is(state)),AEWomens.class, AE_WOMENS);
	}

	// To get unique list of parties from ae_maps , sorted by DESC

	public List<AEMaps> findUnqListOfAEMapPartiesWithSort(String state, int year, int limit) {
		logger.info(" inside findUnqListOfAEMapPartiesWithSort() of AssemblyElectionsRepository class ..");

		Query query = new Query();
		query.addCriteria(Criteria.where("state").is(state).and("year").is(year));
		query.limit(limit).with(new Sort(Sort.Direction.DESC, "party1"));
		return mongoTemplate.find(query, AEMaps.class, AE_MAPS);
	}

	// ae_maps-To get data with specific state, year and for 'Sex1' field.
	// searchvalue is an array ['M','F']

	public List<AEMaps> findAEMapsBasedOnGendrStateYear(String state, int year, List<String> genders) {
		logger.info(" inside findAEMapsBasedOnGendrStateYear() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(
				query(where("state").is(state).and("year").is(year).and("sex1").in(genders)),
				AEMaps.class, AE_MAPS);
	}

	// ae_maps-To get data with specific state, year and for 'RELIGION' field.
	// searchvalue is an array []

	public List<AEMaps> findAEMapsBasedOnRlgnStateYear(String state, int year, List<String> rlgns) {
		logger.info(" inside findAEMapsBasedOnRlgnStateYear() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(
				query(where("state").is(state).and("year").is(Integer.valueOf(year)).and("religion").in(rlgns)),
				AEMaps.class, AE_MAPS);
	}

	// ae_maps-To get data with specific state, year and for 'AC_Type' field.
	// searchvalue is an array []

	public List<AEMaps> findAEMapsBasedOnCmmntyStateYear(String state, int year, List<String> cmmntys) {
		logger.info(" inside findAEMapsBasedOnCmmntyStateYear() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(
				query(where("state").is(state).and("year").is(Integer.valueOf(year)).and("ac_type").in(cmmntys)),
				AEMaps.class, AE_MAPS);
	}

	// ae_maps-To get data with specific state, year and for 'Party1' field.
	// searchvalue is an array []

	public List<AEMaps> findAEMapsBasedOnWnnrsStateYear(String state, int year, List<String> winners) {
		logger.info(" inside findAEMapsBasedOnWnnrsStateYear() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(
				query(where("state").is(state).and("year").is(Integer.valueOf(year)).and("party1").in(winners)),
				AEMaps.class, AE_MAPS);
	}

	@SuppressWarnings("unchecked")
	public List<AEMaps> getUniqueDataBasedOnAnyAEMapField(String state, int year, String filterField) {
		logger.info(" inside getUniqueDataBasedOnAnyAEMapField() of AssemblyElectionsRepository class ..");

		List<AEMaps> aeMaps = null;

		BasicDBObject dbObject = new BasicDBObject();
		dbObject.append("state", state);
		dbObject.append("year", year);

		switch (filterField) {

		case "ac_name":
		case "ac_no":
		case "ac_type":
		case "cand1":
		case "electors":
		case "margin":
		case "margin_percent":
		case "n_cand":
		case "nota_percent":
		case "party1":
		case "position":
		case "religion":
		case "runner":
			aeMaps = mongoTemplate.getCollection(AE_MAPS).distinct(filterField, dbObject);

		default:
			break;
		}

		return aeMaps;

	}

}
