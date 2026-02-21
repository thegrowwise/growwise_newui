/**
 * Unit tests for summer-camp-data configuration.
 *
 * Covers: MATH_OLYMPIAD_TIER_CONFIGS structural invariants,
 * LEARNING_MODE_FORMAT/TIME mappings, ADV_MATH_PROGRAM_KEYS,
 * and SUMMER_CAMP_PROGRAMS integrity.
 */

import {
  SUMMER_CAMP_PROGRAMS,
  LEARNING_MODE_KEYS,
  LEARNING_MODE_FORMAT,
  LEARNING_MODE_TIME,
  ADV_MATH_PROGRAM_KEYS,
  MATH_OLYMPIAD_TIER_CONFIGS,
  type LearningModeKey,
  type OlympiadTierId,
} from '@/lib/summer-camp-data';

describe('LEARNING_MODE_KEYS', () => {
  it('contains exactly inPerson and online', () => {
    expect(LEARNING_MODE_KEYS).toHaveLength(2);
    expect(LEARNING_MODE_KEYS).toContain('inPerson');
    expect(LEARNING_MODE_KEYS).toContain('online');
  });

  it('every key has a corresponding LEARNING_MODE_FORMAT entry', () => {
    LEARNING_MODE_KEYS.forEach((key) => {
      expect(LEARNING_MODE_FORMAT[key]).toBeDefined();
    });
  });

  it('every key has a corresponding LEARNING_MODE_TIME entry', () => {
    LEARNING_MODE_KEYS.forEach((key) => {
      expect(LEARNING_MODE_TIME[key]).toBeDefined();
    });
  });

  it('LEARNING_MODE_FORMAT maps to canonical Slot.format values', () => {
    expect(LEARNING_MODE_FORMAT.inPerson).toBe('In-Person');
    expect(LEARNING_MODE_FORMAT.online).toBe('Online');
  });

  it('LEARNING_MODE_TIME maps to non-empty time strings', () => {
    LEARNING_MODE_KEYS.forEach((key) => {
      expect(typeof LEARNING_MODE_TIME[key]).toBe('string');
      expect(LEARNING_MODE_TIME[key].length).toBeGreaterThan(0);
    });
  });
});

describe('ADV_MATH_PROGRAM_KEYS', () => {
  it('contains exactly algebra and precalculus', () => {
    expect(ADV_MATH_PROGRAM_KEYS).toHaveLength(2);
    expect(ADV_MATH_PROGRAM_KEYS).toContain('algebra');
    expect(ADV_MATH_PROGRAM_KEYS).toContain('precalculus');
  });
});

describe('MATH_OLYMPIAD_TIER_CONFIGS', () => {
  it('contains exactly tier1 and tier2', () => {
    const ids = MATH_OLYMPIAD_TIER_CONFIGS.map((c) => c.id);
    expect(ids).toHaveLength(2);
    expect(ids).toContain('tier1');
    expect(ids).toContain('tier2');
  });

  describe('tier1', () => {
    const tier1 = MATH_OLYMPIAD_TIER_CONFIGS.find((c) => c.id === 'tier1')!;

    it('has slotCount 8', () => expect(tier1.slotCount).toBe(8));
    it('has weeksPerSlot 1', () => expect(tier1.weeksPerSlot).toBe(1));
    it('has hoursPerSlot 15', () => expect(tier1.hoursPerSlot).toBe(15));
    it('has a positive price', () => expect(tier1.price).toBeGreaterThan(0));

    it('generates unique slot IDs for all indices', () => {
      const ids = Array.from({ length: tier1.slotCount }, (_, i) => tier1.slotId(i));
      const unique = new Set(ids);
      expect(unique.size).toBe(tier1.slotCount);
    });

    it('slot IDs are stable (same input → same output)', () => {
      expect(tier1.slotId(0)).toBe(tier1.slotId(0));
      expect(tier1.slotId(7)).toBe(tier1.slotId(7));
    });
  });

  describe('tier2', () => {
    const tier2 = MATH_OLYMPIAD_TIER_CONFIGS.find((c) => c.id === 'tier2')!;

    it('has slotCount 4', () => expect(tier2.slotCount).toBe(4));
    it('has weeksPerSlot 2', () => expect(tier2.weeksPerSlot).toBe(2));
    it('has hoursPerSlot 30', () => expect(tier2.hoursPerSlot).toBe(30));
    it('has a positive price', () => expect(tier2.price).toBeGreaterThan(0));

    it('generates unique slot IDs for all indices', () => {
      const ids = Array.from({ length: tier2.slotCount }, (_, i) => tier2.slotId(i));
      const unique = new Set(ids);
      expect(unique.size).toBe(tier2.slotCount);
    });

    it('tier1 and tier2 slot IDs do not collide', () => {
      const tier1 = MATH_OLYMPIAD_TIER_CONFIGS.find((c) => c.id === 'tier1')!;
      const tier1Ids = new Set(
        Array.from({ length: tier1.slotCount }, (_, i) => tier1.slotId(i))
      );
      Array.from({ length: tier2.slotCount }, (_, i) => tier2.slotId(i)).forEach(
        (id) => expect(tier1Ids.has(id)).toBe(false)
      );
    });
  });
});

describe('SUMMER_CAMP_PROGRAMS', () => {
  it('every program has a unique id', () => {
    const ids = SUMMER_CAMP_PROGRAMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every program category is a known value', () => {
    const validCategories = new Set(['Half-Day Camps', 'Full Day Camps']);
    SUMMER_CAMP_PROGRAMS.forEach((p) => {
      expect(validCategories.has(p.category)).toBe(true);
    });
  });

  it('every program has at least one level with at least one slot', () => {
    SUMMER_CAMP_PROGRAMS.forEach((p) => {
      expect(p.levels.length).toBeGreaterThan(0);
      p.levels.forEach((l) => expect(l.slots.length).toBeGreaterThan(0));
    });
  });

  it('every slot has a unique id within its program', () => {
    SUMMER_CAMP_PROGRAMS.forEach((p) => {
      const slotIds = p.levels.flatMap((l) => l.slots.map((s) => s.id));
      expect(new Set(slotIds).size).toBe(slotIds.length);
    });
  });

  it('every slot price is a positive number', () => {
    SUMMER_CAMP_PROGRAMS.forEach((p) => {
      p.levels.forEach((l) => {
        l.slots.forEach((s) => {
          expect(typeof s.price).toBe('number');
          expect(s.price).toBeGreaterThan(0);
        });
      });
    });
  });

  it('every slot format is Online or In-Person', () => {
    const validFormats = new Set(['Online', 'In-Person']);
    SUMMER_CAMP_PROGRAMS.forEach((p) => {
      p.levels.forEach((l) => {
        l.slots.forEach((s) => {
          expect(validFormats.has(s.format)).toBe(true);
        });
      });
    });
  });

  it('advanced math program exists and is in Half-Day Camps', () => {
    const adv = SUMMER_CAMP_PROGRAMS.find((p) => p.id === 'adv-math');
    expect(adv).toBeDefined();
    expect(adv!.category).toBe('Half-Day Camps');
  });

  it('math olympiad program exists and is in Half-Day Camps', () => {
    const olympiad = SUMMER_CAMP_PROGRAMS.find((p) => p.id === 'math-olympiad');
    expect(olympiad).toBeDefined();
    expect(olympiad!.category).toBe('Half-Day Camps');
  });

  it('roblox in-person program is in Half-Day Camps (moved from Full Day)', () => {
    const roblox = SUMMER_CAMP_PROGRAMS.find((p) => p.id === 'roblox-in-person');
    expect(roblox).toBeDefined();
    expect(roblox!.category).toBe('Half-Day Camps');
  });
});
