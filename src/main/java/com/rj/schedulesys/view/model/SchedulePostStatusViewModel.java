package com.rj.schedulesys.view.model;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePostStatusViewModel {
	
	private Long id;
	
	@NotBlank
	@Size(min = 3, max = 20)
	private String status;
}
