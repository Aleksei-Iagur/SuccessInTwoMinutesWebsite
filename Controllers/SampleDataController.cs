using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SuccessInTwoMinutesWebsite.BusinessLogic;

namespace SuccessInTwoMinutes.Controllers
{
	[Route("api/[controller]/[action]")]
    public class SampleDataController : Controller
    {
		private static List<SuccessRecord> _successRecords = new List<SuccessRecord>();
		ISuccessRepository _successRepository;

		public SampleDataController()
		{
			_successRepository = SuccessRepository.Instance;
		}

		private static string[] Summaries = new[]
		{
			"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
		};

		[HttpGet]
		public IEnumerable<WeatherForecast> WeatherForecasts(int startDateIndex)
		{
			var rng = new Random();
			return Enumerable.Range(1, 5).Select(index => new WeatherForecast
			{
				DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
				TemperatureC = rng.Next(-20, 55),
				Summary = Summaries[rng.Next(Summaries.Length)]
			});
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

		public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }

	public class SuccessRecord
	{
		public string DateFormatted { get; set; }

		public string SuccessText { get; set; }
	}
}
