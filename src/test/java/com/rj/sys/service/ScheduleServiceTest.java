package com.rj.sys.service;

import static org.junit.Assert.assertEquals;

import java.util.Date;

import lombok.extern.slf4j.Slf4j;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.rj.sys.config.TestConfiguration;
import com.rj.sys.dao.FacilityDao;
import com.rj.sys.dao.ScheduleDao;
import com.rj.sys.view.model.ScheduleViewModel;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = TestConfiguration.class)
@TestPropertySource("classpath:test-application.properties")
public class ScheduleServiceTest {
	
	private @Autowired ScheduleService scheduleService;
	private @Autowired FacilityDao facilityDao;
	private @Autowired ScheduleDao scheduleDao ;
	
	@Test
	@Transactional
	public void test(){
		int sizeBeforeCreation = scheduleDao.findAll().size();
		ScheduleViewModel viewModel = ScheduleViewModel.builder()
				.assigneeId(2L)
				.facility("Brandywine")
				.scheduleComment("Comment on the schedule")
				.scheduleDate(new Date())
				.scheduleStatus("CONFIRMED")
				.shift("NIGHT")
				.timesheetReceived(false)
				.build();
		
		ScheduleViewModel vm = scheduleService.createSchedule(viewModel, 1L);
		
		int sizeAfterCreation = scheduleDao.findAll().size();
		assertEquals(sizeAfterCreation, sizeBeforeCreation + 1);
	}
}