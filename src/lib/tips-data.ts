import type { SeasonalTip } from './types';

export const SEASONAL_TIPS: SeasonalTip[] = [
  // January
  { id: '1a', month: 1, title: 'Monitor Winter Stores', content: 'Check hive weight to ensure bees have enough food. Hefting the hive from the back can give you a sense of remaining stores without opening the hive.', category: 'feeding' },
  { id: '1b', month: 1, title: 'Avoid Opening Hives', content: 'Keep hives closed during cold weather. Opening the hive breaks the propolis seal and lets cold air in, which can be deadly for the cluster.', category: 'inspection' },
  { id: '1c', month: 1, title: 'Check Ventilation', content: 'Ensure upper ventilation is adequate to prevent moisture buildup. Moisture is more dangerous to bees in winter than cold temperatures.', category: 'general' },
  { id: '1d', month: 1, title: 'Order Spring Supplies', content: 'Order new equipment, frames, and foundation now so you\'re prepared for spring buildup. Suppliers often run low as spring approaches.', category: 'general' },

  // February
  { id: '2a', month: 2, title: 'Emergency Feeding', content: 'If hives feel light, consider emergency feeding with fondant or sugar bricks placed directly on top of the cluster. Do not use liquid feed in cold weather.', category: 'feeding' },
  { id: '2b', month: 2, title: 'Watch for Dead-Outs', content: 'Check entrance for activity on warm days. No activity may indicate a dead-out. Investigate and clean equipment if colony has perished.', category: 'inspection' },
  { id: '2c', month: 2, title: 'Plan Varroa Treatment', content: 'Research and plan your integrated pest management strategy for the coming season. Order treatments early to have them on hand.', category: 'treatment' },
  { id: '2d', month: 2, title: 'Clean Equipment', content: 'Use winter downtime to scrape, repair, and paint spare hive bodies and frames. Have clean equipment ready for spring splits.', category: 'general' },

  // March
  { id: '3a', month: 3, title: 'First Spring Inspection', content: 'On a warm day (55°F+), do a quick inspection. Check for queen presence (eggs/larvae), food stores, and overall colony strength.', category: 'inspection' },
  { id: '3b', month: 3, title: 'Begin Spring Feeding', content: 'Start feeding 1:1 sugar syrup to stimulate brood production. Add pollen patties if natural pollen is not yet available.', category: 'feeding' },
  { id: '3c', month: 3, title: 'Check for Disease', content: 'Look for signs of Nosema (dysentery streaks on hive), American Foulbrood (sunken cappings), and other diseases during your first inspection.', category: 'treatment' },
  { id: '3d', month: 3, title: 'Reverse Brood Boxes', content: 'If the cluster has moved to the upper box, reverse the boxes to give the queen room to expand the brood nest downward.', category: 'general' },

  // April
  { id: '4a', month: 4, title: 'Swarm Prevention', content: 'Inspect every 7-10 days for swarm cells. Ensure the queen has room to lay by adding supers or making splits if the brood nest is congested.', category: 'inspection' },
  { id: '4b', month: 4, title: 'Add Supers', content: 'Add honey supers when bees begin to draw out the last frames in the brood box. Adding supers early helps prevent swarming.', category: 'harvest' },
  { id: '4c', month: 4, title: 'Spring Varroa Treatment', content: 'Conduct a mite wash or alcohol roll to assess Varroa levels. Treat if mite count exceeds 2-3 mites per 100 bees.', category: 'treatment' },
  { id: '4d', month: 4, title: 'Make Spring Splits', content: 'Strong colonies can be split to increase your apiary and prevent swarming. Ensure each split has a queen or queen cells.', category: 'general' },

  // May
  { id: '5a', month: 5, title: 'Peak Swarm Season', content: 'Weekly inspections are critical. Look for queen cups with eggs/larvae (swarm cells). Have swarm traps set up nearby to catch any swarms.', category: 'inspection' },
  { id: '5b', month: 5, title: 'Monitor Honey Flow', content: 'Check supers regularly. Add additional supers when the current ones are 70-80% full. Bees can fill supers remarkably fast during a strong flow.', category: 'harvest' },
  { id: '5c', month: 5, title: 'Stop Feeding During Flow', content: 'Remove feeders when natural nectar is abundant. Feeding during a honey flow can result in sugar syrup stored in your honey supers.', category: 'feeding' },
  { id: '5d', month: 5, title: 'Requeen if Needed', content: 'Replace underperforming queens now while mating conditions are favorable. New queens will boost colony productivity.', category: 'general' },

  // June
  { id: '6a', month: 6, title: 'Honey Super Management', content: 'Keep adding supers as needed. Never let the bees run out of storage space, as this triggers swarming behavior.', category: 'harvest' },
  { id: '6b', month: 6, title: 'Summer Varroa Check', content: 'Do a mid-season mite count. Varroa populations grow exponentially with the bee population and can crash a colony by fall if untreated.', category: 'treatment' },
  { id: '6c', month: 6, title: 'Water Source', content: 'Ensure bees have access to a clean water source nearby. Bees need water for cooling the hive and diluting honey for consumption.', category: 'general' },
  { id: '6d', month: 6, title: 'Check Brood Pattern', content: 'A solid, consistent brood pattern indicates a healthy, productive queen. Spotty patterns may indicate queen issues or disease.', category: 'inspection' },

  // July
  { id: '7a', month: 7, title: 'Heat Management', content: 'Ensure adequate ventilation. Consider providing shade in extreme heat. Bees bearding at the entrance on hot evenings is normal behavior.', category: 'general' },
  { id: '7b', month: 7, title: 'First Harvest', content: 'Harvest honey from fully capped frames. Only harvest supers above the queen excluder to avoid taking brood frames.', category: 'harvest' },
  { id: '7c', month: 7, title: 'Watch for Robbing', content: 'As nectar flows slow, stronger colonies may rob weaker ones. Reduce entrances on smaller colonies and avoid spilling syrup near hives.', category: 'inspection' },
  { id: '7d', month: 7, title: 'Beetle Traps', content: 'Small hive beetles are most active in summer. Install beetle traps and keep colonies strong - bees can manage beetles in strong colonies.', category: 'treatment' },

  // August
  { id: '8a', month: 8, title: 'Late Summer Harvest', content: 'Complete your honey harvest, leaving enough stores for the bees. In most regions, leave at least 60-80 pounds of honey for winter.', category: 'harvest' },
  { id: '8b', month: 8, title: 'Critical Varroa Treatment', content: 'Treat for Varroa mites NOW. August treatment protects the "winter bees" that will be born in September-October and need to survive until spring.', category: 'treatment' },
  { id: '8c', month: 8, title: 'Assess Queen Performance', content: 'Evaluate queen laying patterns. Requeen weak colonies now so the new queen can build up the winter population.', category: 'inspection' },
  { id: '8d', month: 8, title: 'Begin Fall Feeding', content: 'If stores are low after harvest, begin feeding 2:1 sugar syrup (2 parts sugar to 1 part water) to help bees build winter stores.', category: 'feeding' },

  // September
  { id: '9a', month: 9, title: 'Fall Inspection', content: 'Do a thorough fall inspection. Check for a laying queen, adequate stores (60-80 lbs), healthy brood, and low mite counts.', category: 'inspection' },
  { id: '9b', month: 9, title: 'Continue Feeding if Needed', content: 'Keep feeding 2:1 syrup until bees have adequate stores or they stop taking the feed. Bees need to have stores capped before cold weather.', category: 'feeding' },
  { id: '9c', month: 9, title: 'Reduce Entrances', content: 'Install entrance reducers to help guard bees defend against robbing and to start weatherproofing for winter.', category: 'general' },
  { id: '9d', month: 9, title: 'Remove Queen Excluders', content: 'Remove queen excluders for winter. If the cluster moves up during winter, a queen excluder can trap the queen below, leading to her death.', category: 'general' },

  // October
  { id: '10a', month: 10, title: 'Winterize Hives', content: 'Add mouse guards, reduce entrances, and ensure upper ventilation. In cold climates, consider wrapping hives with insulation or tar paper.', category: 'general' },
  { id: '10b', month: 10, title: 'Final Mite Check', content: 'Do one last mite count. If levels are still high, apply an oxalic acid treatment during the broodless period in late fall.', category: 'treatment' },
  { id: '10c', month: 10, title: 'Wind Protection', content: 'Set up windbreaks if your apiary is in an exposed location. Secure hive tops with bricks or straps to prevent them from blowing off.', category: 'general' },
  { id: '10d', month: 10, title: 'Last Feeding Window', content: 'This is your last chance to feed. Bees cannot process syrup effectively once temperatures stay below 50°F consistently.', category: 'feeding' },

  // November
  { id: '11a', month: 11, title: 'Hands-Off Period Begins', content: 'Avoid opening hives. You can still observe entrance activity on warm days and listen at the side of the hive for the cluster\'s gentle hum.', category: 'inspection' },
  { id: '11b', month: 11, title: 'Check Hive Weight', content: 'Periodically heft hives from the back to gauge food stores. A noticeably lighter hive may need emergency feeding with fondant.', category: 'feeding' },
  { id: '11c', month: 11, title: 'Oxalic Acid Treatment', content: 'When brood rearing has paused, apply oxalic acid dribble or vaporization for effective Varroa control during the broodless window.', category: 'treatment' },
  { id: '11d', month: 11, title: 'Review Season Notes', content: 'Review your inspection records from the past season. Identify patterns, note which colonies performed best, and plan improvements.', category: 'general' },

  // December
  { id: '12a', month: 12, title: 'Winter Monitoring', content: 'On calm days, listen at the hive. A healthy cluster produces a gentle hum. Silence may indicate a problem.', category: 'inspection' },
  { id: '12b', month: 12, title: 'Manage Moisture', content: 'Check that upper ventilation is working. Look for signs of excessive moisture (frost on inner cover). Add moisture quilts if needed.', category: 'general' },
  { id: '12c', month: 12, title: 'Plan Next Season', content: 'Use winter to plan: order bees if expanding, schedule queen rearing, plan crop rotations near your apiary, and set goals for the new year.', category: 'general' },
  { id: '12d', month: 12, title: 'Emergency Sugar Board', content: 'If hives feel light, place a sugar board or fondant directly on top of the frames. This provides emergency food without opening the hive fully.', category: 'feeding' },
];
