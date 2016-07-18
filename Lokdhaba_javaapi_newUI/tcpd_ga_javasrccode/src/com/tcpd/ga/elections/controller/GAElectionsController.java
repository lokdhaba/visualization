package com.tcpd.ga.elections.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.tcpd.ga.elections.dao.AEMapsRepository;
import com.tcpd.ga.elections.dao.GEMapsRepository;
import com.tcpd.ga.elections.model.AEDpstLossContst;
import com.tcpd.ga.elections.model.AEMaps;
import com.tcpd.ga.elections.model.AEPartiesContst;
import com.tcpd.ga.elections.model.AESeatShares;
import com.tcpd.ga.elections.model.AEVoteShares;
import com.tcpd.ga.elections.model.AEVotrTurnouts;
import com.tcpd.ga.elections.model.AEWomens;
import com.tcpd.ga.elections.model.ColorCodes;
import com.tcpd.ga.elections.model.GEDpstLossContsts;
import com.tcpd.ga.elections.model.GEMaps;
import com.tcpd.ga.elections.model.GEPartiesContsts;
import com.tcpd.ga.elections.model.GESeatShares;
import com.tcpd.ga.elections.model.GEVoteShares;
import com.tcpd.ga.elections.model.GEVotrTurnouts;
import com.tcpd.ga.elections.model.GEWomens;
import com.tcpd.ga.elections.vo.AEPartiesResponseVO;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 04/05/2016
 *
 */
@Controller
@RequestMapping("/api")
public class GAElectionsController {

	private static final Logger logger = LoggerFactory.getLogger(GAElectionsController.class);
	private static final String APPLICATION_JSON = "application/json";
	/*private static final String APPLICATION_XML = "application/xml";
	private static final String APPLICATION_HTML = "text/html";*/

	@Autowired
	private AEMapsRepository aeRepository;

	@Autowired
	private GEMapsRepository geRepository;

	@RequestMapping(value = "/elections/ae_contested_deposit_losts", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEDpstLossContst> getAllAEDpstLossContst(@RequestParam("state") String state) {
		logger.info("Inside getAllAEWomens() method of GAElectionsController ...");

		List<AEDpstLossContst> aeDpstLossContsts = aeRepository.findAllAEDpstLossContst(state);

		logger.info("========= AE DpstLossContst size.... " + aeDpstLossContsts.size());
		return aeDpstLossContsts;
	}

	@RequestMapping(value = "/elections/ae_parties_contests", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEPartiesContst> getAEPartiesContst(@RequestParam("state") String state) {
		logger.info("Inside getAEPartiesContst) method of GAElectionsController ...");

		List<AEPartiesContst> aePartiesContsts = aeRepository.findAllAEPartiesContst(state);

		logger.info("========= AEPartiesContst size.... " + aePartiesContsts.size());
		return aePartiesContsts;
	}

	@RequestMapping(value = "/elections/ae_seatshares", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AESeatShares> getAESeatShares(@RequestParam("state") String state) {
		logger.info("Inside getAESeatShares() method of GAElectionsController ...");

		List<AESeatShares> aeWomens = aeRepository.findAllAESeatShares(state);

		logger.info("========= AE SeatShares size.... " + aeWomens.size());
		return aeWomens;
	}

	@RequestMapping(value = "/elections/ae_voteshares", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEVoteShares> getAEVoteShars(@RequestParam("state") String state) {
		logger.info("Inside getAEVoteShars() method of GAElectionsController ...");

		List<AEVoteShares> aeVoteShares = aeRepository.findAllAEVoteShars(state);

		logger.info("========= AE VoteShars size.... " + aeVoteShares.size());
		return aeVoteShares;
	}

	@RequestMapping(value = "/elections/ae_voter_turnouts", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEVotrTurnouts> getAEVtrTurnOuts(@RequestParam("state") String state) {
		logger.info("Inside getAEVtrTurnOuts() method of GAElectionsController ...");

		List<AEVotrTurnouts> aeVotrTurnouts = aeRepository.findAllAEVtrTurnOuts(state);

		logger.info("========= AE VotrTurnouts size.... " + aeVotrTurnouts.size());
		return aeVotrTurnouts;
	}

	@RequestMapping(value = "/elections/ae_womens", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEWomens> getAEWomens(@RequestParam("state") String state) {
		logger.info("Inside getAEPartiesContst() method of GAElectionsController ...");

		List<AEWomens> aeWomens = aeRepository.findAllAEWomens(state);

		logger.info("========= AE Womens size.... " + aeWomens.size());
		return aeWomens;
	}

	@RequestMapping(value = "/elections/ae_maps", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAllMaps() {
		logger.info("Inside getAllMaps() method of controller...");

		List<AEMaps> aeMaps = aeRepository.getAllAEMaps();

		logger.info("========= AE Maps size.... " + aeMaps.size());
		return aeMaps;
	}

	@RequestMapping(value = "/ae/states", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getUniqueAEMapStates() {
		logger.info("Inside getUniqueAEMapStates() method of controller...");

		List<AEMaps> aeUniqStates = aeRepository.getUniqueAEMapStates();

		logger.info("========= AE UniqueAEMapStates size.... " + aeUniqStates.size());
		return aeUniqStates;
	}

	// @RequestParam("title")String title
	@RequestMapping(value = "/ae/year", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getUniqueAEMapYears(@RequestParam("state") String state) {
		logger.info("Inside getUniqueAEMapYears() method of controller...");

		List<AEMaps> aeUniqYrs = aeRepository.getUniqueAEMapYears(state);

		logger.info("========= AE Maps aeUniqYrs size.... " + aeUniqYrs.size());
		return aeUniqYrs;
	}

	@RequestMapping(value = "/ae/elections", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getUniqueAEMapStateYears(@RequestParam("state") String state,
			@RequestParam("year") int year) {
		logger.info("Inside getUniqueAEMapStateYears() method of controller...");

		List<AEMaps> aeStatsYrs = aeRepository.getAEMapStatsYears(state, year);

		logger.info("========= UniqueAEMapStateYears size.... " + aeStatsYrs.size());
		return aeStatsYrs;
	}

	@RequestMapping(value = "/ae/elections/position", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAEMapPositionsForStatsYears(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("position") int position) {
		logger.info("Inside getAEMapPositionsForStatsYears() method of controller...");

		List<AEMaps> aePstns4StatsYrs = aeRepository.getAEMapPositionsForStatsYears(state, year, position);

		logger.info("========= getAEMapPositionsForStatsYears size.... " + aePstns4StatsYrs.size());
		return aePstns4StatsYrs;
	}

	@RequestMapping(value = "/ae/partieslist", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getUnqListOfAEMapPartiesWithSort(@RequestParam("state") String state,
			@RequestParam("year") int year) {
		logger.info("Inside getAEMapPositionsForStatsYears() method of controller...");

		List<AEMaps> aeUnqPrtsByStatYr = aeRepository.getUniqueAEMapParties(state, year);

		logger.info("========= aeUnqPrtsByStatYr size.... " + aeUnqPrtsByStatYr.size());
		return aeUnqPrtsByStatYr;
	}

	@RequestMapping(value = "/ae/parties", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEPartiesResponseVO> getUnqListOfAEMapPartiesWithLimit(
			@RequestParam("state") String state, @RequestParam("year") int year, @RequestParam("limit") int limit) {
		logger.info("Inside getAEMapPositionsForStatsYears() method of controller...");

		List<AEMaps> aeUnqPrtsWthSort = aeRepository.findUnqListOfAEMapPartiesWithSort(state, year, limit);
		List<AEPartiesResponseVO> aePartiesResponseVOs = new ArrayList<>();
		Map<String, Integer> partiesCount = new HashMap<String, Integer>();

		for (AEMaps aeMaps : aeUnqPrtsWthSort) {
			if (partiesCount.containsKey(aeMaps.getParty1())) {
				partiesCount.put(aeMaps.getParty1(), partiesCount.get(aeMaps.getParty1()) + 1);
			} else {
				partiesCount.put(aeMaps.getParty1(), 1);
			}
		}

		for (Map.Entry<String, Integer> entry : partiesCount.entrySet()) {
			AEPartiesResponseVO partiesResponseVO = new AEPartiesResponseVO();
			logger.info(entry.getKey() + " = " + entry.getValue());
			partiesResponseVO.setParty1(entry.getKey());
			partiesResponseVO.setCount(entry.getValue());
			aePartiesResponseVOs.add(partiesResponseVO);
		}

		logger.info("========= getAEMapPositionsForStatsYears size.... " + aePartiesResponseVOs.size());
		return aePartiesResponseVOs;
	}

	@RequestMapping(value = "/ae/elections/gender", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAEMapsBasedOnGendrStateYear(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("searchvalue") List<String> genders) {
		logger.info("Inside getAEMapsBasedOnGendrStateYear() method of controller...");

		List<AEMaps> aeGndrStateYrs = aeRepository.findAEMapsBasedOnGendrStateYear(state, year, genders);

		logger.info("========= AEMapsBasedOnGendrStateYear size.... " + aeGndrStateYrs.size());
		return aeGndrStateYrs;
	}

	@RequestMapping(value = "/ae/elections/religion", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAEMapsBasedOnRlgnStateYear(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("searchvalue") List<String> rlgns) {
		logger.info("Inside getAEMapsBasedOnRlgnStateYear() method of controller...");

		List<AEMaps> aeRlgnStateYrs = aeRepository.findAEMapsBasedOnRlgnStateYear(state, year, rlgns);

		logger.info("========= AEMapsBasedOnRlgnStateYear size.... " + aeRlgnStateYrs.size());
		return aeRlgnStateYrs;
	}

	@RequestMapping(value = "/ae/elections/community", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAEMapsBasedOnComuntyStateYear(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("searchvalue") List<String> communities) {
		logger.info("Inside getAEMapsBasedOnComuntyStateYear() method of controller...");

		List<AEMaps> aeCmmntyStateYrs = aeRepository.findAEMapsBasedOnCmmntyStateYear(state, year, communities);

		logger.info("========= AEMapsBasedOnComuntyStateYear size.... " + aeCmmntyStateYrs.size());
		return aeCmmntyStateYrs;
	}

	@RequestMapping(value = "/ae/elections/winners", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getAEMapsBasedOnWinnrsStateYear(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("searchvalue") List<String> winners) {
		logger.info("Inside getAEMapsBasedOnWnnrsStateYear() method of controller...");

		List<AEMaps> aeWnnrsStateYrs = aeRepository.findAEMapsBasedOnWnnrsStateYear(state, year, winners);

		logger.info("========= AEMapsBasedOnWnnrsStateYear size.... " + aeWnnrsStateYrs.size());
		return aeWnnrsStateYrs;
	}

	@RequestMapping(value = "/ae/elections/filter", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEMaps> getUniqueDataBasedOnAnyAEMapField(@RequestParam("state") String state,
			@RequestParam("year") int year, @RequestParam("filtervalue") String filterField) {
		logger.info("Inside getUniqueDataBasedOnAnyAEMapField() method of controller...");

		List<AEMaps> aeWnnrsStateYrs = aeRepository.getUniqueDataBasedOnAnyAEMapField(state, year, filterField);

		logger.info("========= UniqueDataBasedOnAnyAEMapField size.... " + aeWnnrsStateYrs.size());
		return aeWnnrsStateYrs;
	}

	/**
	 * *************************************************************************
	 * The following methods are implemented to get the Data from GE Maps tables
	 * 
	 * *************************************************************************
	 * 
	 */

	@RequestMapping(value = "/elections/ge_contested_deposit_losts", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEDpstLossContsts> getAllGEDpstLossContst() {
		logger.info("Inside getAllGEDpstLossContst() method of GAElectionsController ...");

		List<GEDpstLossContsts> geDpstLossContsts = geRepository.findAllGEDpstLossContst();

		logger.info("========= GE DpstLossContst size.... " + geDpstLossContsts.size());
		return geDpstLossContsts;
	}

	@RequestMapping(value = "/elections/ge_parties_contests", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEPartiesContsts> getGEPartiesContst() {
		logger.info("Inside getGEPartiesContst) method of GAElectionsController ...");

		List<GEPartiesContsts> gePartiesContsts = geRepository.findAllGEPartiesContst();

		logger.info("========= AEPartiesContst size.... " + gePartiesContsts.size());
		return gePartiesContsts;
	}

	@RequestMapping(value = "/elections/ge_seatshares", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GESeatShares> getGESeatShares() {
		logger.info("Inside getGESeatShares() method of GAElectionsController ...");

		List<GESeatShares> geSeatShares = geRepository.findAllGESeatShares();

		logger.info("========= GE SeatShares size.... " + geSeatShares.size());
		return geSeatShares;
	}

	@RequestMapping(value = "/elections/ge_voteshares", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEVoteShares> getGEVoteShars() {
		logger.info("Inside getGEVoteShars() method of GAElectionsController ...");

		List<GEVoteShares> geVoteShares = geRepository.findAllGEVoteShars();

		logger.info("========= AE VoteShars size.... " + geVoteShares.size());
		return geVoteShares;
	}

	@RequestMapping(value = "/elections/ge_voter_turnouts", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEVotrTurnouts> getGEVtrTurnOuts() {
		logger.info("Inside getAEVtrTurnOuts() method of GAElectionsController ...");

		List<GEVotrTurnouts> geVotrTurnouts = geRepository.findAllGEVtrTurnOuts();

		logger.info("========= GE VotrTurnouts size.... " + geVotrTurnouts.size());
		return geVotrTurnouts;
	}

	@RequestMapping(value = "/elections/ge_womens", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEWomens> getGEWomens() {
		logger.info("Inside getAEPartiesContst() method of GAElectionsController ...");

		List<GEWomens> geWomens = geRepository.findAllGEWomens();

		logger.info("========= GE Womens size.... " + geWomens.size());
		return geWomens;
	}

	@RequestMapping(value = "/party/colors", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ColorCodes> getAllColorCodes() {
		logger.info("Inside getAllColorCodes() method of GAElectionsController ...");

		List<ColorCodes> colorCodes = geRepository.findAllColorCodes();

		logger.info("========= GE Womens size.... " + colorCodes.size());
		return colorCodes;
	}

	@RequestMapping(value = "/ge/year", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEMaps> getUniqueGEMapYears() {
		logger.info("Inside getUniqueGEMapYears() method of controller...");

		List<GEMaps> geMapsUnqYrs = geRepository.getUniqueGEMapYears();

		logger.info("========= GE MapsUnqYrs size.... " + geMapsUnqYrs.size());
		return geMapsUnqYrs;
	}

	@RequestMapping(value = "/ge/elections", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEMaps> getAllGEMapsByYear(@RequestParam int year) {
		logger.info("Inside getAllGEMapsByYear() method of controller...");

		List<GEMaps> geMapsUnqYrs = geRepository.findGEMapByYear(year);

		logger.info("========= GE MapsUnqYrs size.... " + geMapsUnqYrs.size());
		return geMapsUnqYrs;
	}

	@RequestMapping(value = "/ge/partieslist", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEMaps> getUnqListOfGEMapPartiesByYr(@RequestParam("year") int year) {
		logger.info("Inside getUnqListOfGEMapPartiesByYr() method of controller...");

		List<GEMaps> geUnqPrtsByYr = geRepository.findUniqueGEMapPartiesYr(year);

		logger.info("========= UnqListOfGEMapPartiesByYr size.... " + geUnqPrtsByYr.size());
		return geUnqPrtsByYr;
	}

	@RequestMapping(value = "/ge/elections/parties", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEMaps> getAllGEMapsByYearPrty(@RequestParam("party") String party,
			@RequestParam("year") int year) {
		logger.info("Inside getAllGEMapsByYearPrty() method of controller...");

		List<GEMaps> geMapsUnqYrs = geRepository.findGEMapByPartyYear(party, year);

		logger.info("========= GE MapsUnqYrs size.... " + geMapsUnqYrs.size());
		return geMapsUnqYrs;
	}

	@RequestMapping(value = "/ge/elections/position", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<GEMaps> getAllGEMapsByYearPosition(@RequestParam("year") int year,
			@RequestParam("position") int position) {
		logger.info("Inside getAllGEMapsByYearPosition() method of controller...");

		List<GEMaps> geMapsUnqYrPosition = geRepository.findGEMapPositionsForYears(year, position);

		logger.info("========= GE MapsUnqYrs size.... " + geMapsUnqYrPosition.size());
		return geMapsUnqYrPosition;
	}

	// ge_maps-To get unique parties (Party1 column) and its count, filtered by
	// Year and limit the number of rows

	@RequestMapping(value = "/ge/parties", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<AEPartiesResponseVO> getUnqListOfGEMapPartiesWithLimit(@RequestParam("year") int year,
			@RequestParam("limit") int limit) {
		logger.info("Inside getUnqListOfGEMapPartiesWithLimit() method of controller...");

		List<GEMaps> aeUnqPrtsWthSort = geRepository.findUnqListOfGEPartiesByYearWithLimit(year, limit);
		List<AEPartiesResponseVO> aePartiesResponseVOs = new ArrayList<>();
		Map<String, Integer> partiesCount = new HashMap<String, Integer>();

		for (GEMaps geMaps : aeUnqPrtsWthSort) {
			if (partiesCount.containsKey(geMaps.getParty1())) {
				partiesCount.put(geMaps.getParty1(), partiesCount.get(geMaps.getParty1()) + 1);
			} else {
				partiesCount.put(geMaps.getParty1(), 1);
			}
		}

		for (Map.Entry<String, Integer> entry : partiesCount.entrySet()) {
			AEPartiesResponseVO partiesResponseVO = new AEPartiesResponseVO();
			logger.info(entry.getKey() + " = " + entry.getValue());
			partiesResponseVO.setParty1(entry.getKey());
			partiesResponseVO.setCount(entry.getValue());
			aePartiesResponseVOs.add(partiesResponseVO);
		}

		logger.info("========= getUnqListOfGEMapPartiesWithLimit size.... " + aePartiesResponseVOs.size());
		return aePartiesResponseVOs;
	}

	/**
	 * Simply selects the home view to render by returning its name.
	 * 
	 
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String status(ModelMap modelMap) {
		String msg = "This is a Default Status Message..... Successfully called the REST controller....";
		modelMap.addAttribute("msg", msg);
		return "index.html";
	}
	*/
	@RequestMapping(value = "/", method = RequestMethod.GET)
    public String welcome() {
          return "index.html";
    }
	

}
