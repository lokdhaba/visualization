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

import com.tcpd.ga.elections.model.ColorCodes;
import com.tcpd.ga.elections.model.GEDpstLossContsts;
import com.tcpd.ga.elections.model.GEMaps;
import com.tcpd.ga.elections.model.GEPartiesContsts;
import com.tcpd.ga.elections.model.GESeatShares;
import com.tcpd.ga.elections.model.GEVoteShares;
import com.tcpd.ga.elections.model.GEVotrTurnouts;
import com.tcpd.ga.elections.model.GEWomens;
import com.mongodb.BasicDBObject;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 26/05/2016
 *
 */

@Repository
public class GEMapsRepository {

	private static final Logger logger = LoggerFactory.getLogger(GEMapsRepository.class);

	// GE related mongodb column names.

	private static final String GE_MAPS = "ge_maps";
	private static final String GE_CONTESTED_DEPOSIT_LOSTS = "ge_contested_deposit_losts";
	private static final String GE_PARTIES_CONTESTS = "ge_parties_contests";
	private static final String GE_SEATSHARES = "ge_seatshares";
	private static final String GE_VOTESHARES = "ge_voteshares";
	private static final String GE_VOTER_TURNOUTS = "ge_voter_turnouts";
	private static final String GE_WOMENS = "ge_womens";
	private static final String COLOR_CODES = "color_codes";

	@Autowired
	private MongoTemplate mongoTemplate;

	// Get all data from ae_contested_deposit_losts

	public List<GEDpstLossContsts> findAllGEDpstLossContst() {
		logger.info(" inside findAllGEDpstLossContst() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GEDpstLossContsts.class, GE_CONTESTED_DEPOSIT_LOSTS);
	}

	// Get all data from ae_parties_contests

	public List<GEPartiesContsts> findAllGEPartiesContst() {
		logger.info(" inside findAllGEPartiesContst() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GEPartiesContsts.class, GE_PARTIES_CONTESTS);
	}

	// Get all data from ae_seatshares

	public List<GESeatShares> findAllGESeatShares() {
		logger.info(" inside findAllGESeatShares() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GESeatShares.class, GE_SEATSHARES);
	}

	// Get all data from ae_voteshares

	public List<GEVoteShares> findAllGEVoteShars() {
		logger.info(" inside findAllGEVoteShars() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GEVoteShares.class, GE_VOTESHARES);
	}

	// Get all data from ae_voter_turnouts

	public List<GEVotrTurnouts> findAllGEVtrTurnOuts() {
		logger.info(" inside findAllGEVtrTurnOuts() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GEVotrTurnouts.class, GE_VOTER_TURNOUTS);
	}

	// Get all data from ae_womens

	public List<GEWomens> findAllGEWomens() {
		logger.info(" inside findAllGEWomens() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(GEWomens.class, GE_WOMENS);
	}

	// Get all data from color_codes

	public List<ColorCodes> findAllColorCodes() {
		logger.info(" inside findAllColorCodes() of GeneralElectionsRepository class ..");
		return mongoTemplate.findAll(ColorCodes.class, COLOR_CODES);
	}

	// To get unique years from ge_maps

	@SuppressWarnings("unchecked")
	public List<GEMaps> getUniqueGEMapYears() {
		logger.info(" inside getUniqueGEMapYears() of GeneralElectionsRepository class ..");
		return mongoTemplate.getCollection(GE_MAPS).distinct("year");
	}

	// To get unique list of parties from ae_maps , sorted by DESC

	public List<GEMaps> findUnqListOfGEPartiesByYearWithLimit(int year, int limit) {
		logger.info(" inside findUnqListOfGEPartiesByYearWithLimit() of GeneralElectionsRepository class ..");

		Query query = new Query();
		query.addCriteria(Criteria.where("year").is(year));
		query.limit(limit).with(new Sort(Sort.Direction.DESC, "party1"));
		return mongoTemplate.find(query, GEMaps.class, GE_MAPS);
	}

	// ge_maps- To get all data filtered by Year column

	public List<GEMaps> findGEMapByYear(int year) {
		logger.info(" inside findGEMapByYear() of GeneralElectionsRepository class .." + year);

		Query query = new Query();
		query.addCriteria(Criteria.where("year").is(year));
		return mongoTemplate.find(query, GEMaps.class, GE_MAPS);
	}

	// ge_maps- To get unique parties list(Party1 column) filtered by year
	public List<GEMaps> findUniqueGEMapPartiesYr(int year) {
		logger.info(" inside findUniqueGEMapPartiesYr() of GeneralElectionsRepository class ..");
		BasicDBObject dbObject = new BasicDBObject();
		dbObject.append("year", year);

		return mongoTemplate.getCollection(GE_MAPS).distinct("party1", dbObject);
	}

	// ge_maps- To get all data filtered by Year and Party1 column

	public List<GEMaps> findGEMapByPartyYear(String party, int year) {
		logger.info(" inside getAEMapStatsYears() of GeneralElectionsRepository class ..");

		return mongoTemplate.find(query(where("party1").is(party).and("year").is(year)), GEMaps.class,
				GE_MAPS);
	}

	// ge_maps- To get all data filtered by Year and Position column
	public List<GEMaps> findGEMapPositionsForYears(int year, int position) {
		logger.info(" inside getAEMapPositionsForStatsYears() of AssemblyElectionsRepository class ..");

		return mongoTemplate.find(
				query(where("year").is(Integer.valueOf(year)).and("position").is(Integer.valueOf(position))),
				GEMaps.class, GE_MAPS);
	}
}
