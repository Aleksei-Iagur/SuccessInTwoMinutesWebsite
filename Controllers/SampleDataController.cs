using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SuccessInTwoMinutesWebsite.BusinessLogic;

namespace SuccessInTwoMinutes.Controllers
{
	[Route("api/[controller]/[action]")]
    public class SampleDataController : Controller
    {
		ISuccessRepository _successRepository;

		public SampleDataController()
		{
			_successRepository = SuccessRepository.Instance;
		}

		[HttpGet]
		public IEnumerable<SuccessRecord> SuccessRecords(int startDateIndex)
		{
			const int minimumDatesRangeInDays = 5;
			var since = DateTime.UtcNow.Date.AddDays(startDateIndex);
			var until = DateTime.UtcNow.Date.AddDays(startDateIndex + minimumDatesRangeInDays - 1);
			var result = _successRepository.GetRecords(since, until);

			return result;
		}

		[HttpPost]
		public IActionResult AddSuccessRecord([FromBody]SuccessRecord success)
		{
			_successRepository.AddRecord(success);
			return StatusCode(200);
		}

		[HttpPost]
		public IActionResult RemoveSuccessRecord([FromBody]SuccessRecord record)
		{
			_successRepository.RemoveRecord(record);
			return StatusCode(200);
		}
	}

	public class SuccessRecord
	{
		public string DateFormatted { get; set; }

		public string SuccessText { get; set; }
	}
}
