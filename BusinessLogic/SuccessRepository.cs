using System;
using System.Collections.Generic;
using System.Linq;
using SuccessInTwoMinutes.Controllers;

namespace SuccessInTwoMinutesWebsite.BusinessLogic
{
	public class SuccessRepository : ISuccessRepository
	{
		List<SuccessRecord> _storage;
		static SuccessRepository _instance;
		static object _lock = new object();

		public SuccessRepository()
		{
			var rng = new Random();
			_storage = new List<SuccessRecord>();

			for (var i = 0; i < 100; i++)
			{
				_storage.Add(
					new SuccessRecord
					{
						DateFormatted = DateTime.Now.AddDays(-50 + i).ToString("d"),
						SuccessText = Successes[rng.Next(Successes.Length)]
					});
			}
		}

		public static SuccessRepository Instance
		{
			get
			{
				if (_instance == null)
				{
					lock (typeof(int))
					{
						if (_instance == null)
						{
							_instance = new SuccessRepository();
						}
					}
				}

				return _instance;
			}
		}

		public SuccessRecord[] GetRecords(DateTime since, DateTime until)
		{
			var result = _storage
				.Where(rec => DateTime.Parse(rec.DateFormatted) >= since && DateTime.Parse(rec.DateFormatted) <= until)
				.OrderBy(rec => rec.DateFormatted)
				.ToArray();

			return result;
		}

		public void AddRecord(SuccessRecord record)
		{
			_storage.Add(record);
		}

		private static string[] Successes = new[]
		{
			"Baked cookies", "Did push-ups", "Ran a marathon", "Made somebody laugh", "Helped somebody", "Made some changes to SuccessInTwoMinutes", "Solved an algorithm puzzle", "Phoned a friend", "Read 10 pages in a book", "Wrote 10 sentences in a blog"
		};
	}
}
