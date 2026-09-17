// =====================================================================
// CogniFlow AI: Comprehensive 60+ LeetCode Algorithms Curriculum
// Linear and Non-Linear Data Structures & Visual Benchmark Suite
// =====================================================================

import { Challenge } from './types';

export interface DSAChallengeMeta extends Challenge {
  category:
    | 'arrays'
    | 'sliding-window'
    | 'linked-list'
    | 'stacks-queues'
    | 'trees'
    | 'graphs'
    | 'dp'
    | 'sorting-searching'
    | 'backtracking-heaps';
  difficultyTag: 'Easy' | 'Medium' | 'Hard';
  lcNumber?: number;
}

export const LEETCODE_CHALLENGES: DSAChallengeMeta[] = [
  // ── 1. ARRAYS & TWO POINTERS ──
  {
    id: '30000000-0000-0000-0000-000000000002',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 167,
    title: 'Two Sum II: Input Array Is Sorted (LC 167)',
    slug: 'two-sum-ii',
    problemStatement:
      'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return their indices (1-indexed).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def two_sum(numbers: list[int], target: int) -> list[int]:
    left = 0
    right = len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []

numbers = [2, 7, 11, 15]
target = 9
result = two_sum(numbers, target)
print(result)`,
      javascript: `function twoSum(numbers, target) {
    let left = 0, right = numbers.length - 1;
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left + 1, right + 1];
        if (sum < target) left++;
        else right--;
    }
    return [];
}`,
      pseudocode: `ALGORITHM twoSum(numbers, target):
    left = 0
    right = length(numbers) - 1
    WHILE left < right:
        sum = numbers[left] + numbers[right]
        IF sum == target THEN
            RETURN [left + 1, right + 1]
        ELSE IF sum < target THEN
            left = left + 1
        ELSE
            right = right - 1
    RETURN []`,
    },
    initialVisualState: { type: 'ARRAY', elements: [2, 7, 11, 15], target: 9 },
    testCases: [{ input: { numbers: [2, 7, 11, 15], target: 9 }, expected: [1, 2] }],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 1,
  },
  {
    id: '30000000-0000-0000-0000-000000000011',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 15,
    title: '3Sum: Zero Sum Triplets (LC 15)',
    slug: '3sum-triplets',
    problemStatement:
      'Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]: left += 1
                while left < right and nums[right] == nums[right-1]: right -= 1
                left += 1; right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return res

nums = [-4, -1, -1, 0, 1, 2]
print(three_sum(nums))`,
      pseudocode: `ALGORITHM threeSum(nums):
    SORT(nums)
    FOR i = 0 TO length(nums) - 3:
        left = i + 1, right = length(nums) - 1
        WHILE left < right:
            sum = nums[i] + nums[left] + nums[right]
            IF sum == 0 THEN record triplet; advance left, retreat right
            ELSE IF sum < 0 THEN left = left + 1
            ELSE right = right - 1`,
    },
    initialVisualState: { type: 'ARRAY', elements: [-4, -1, -1, 0, 1, 2] },
    testCases: [{ input: { numbers: [-4, -1, -1, 0, 1, 2] }, expected: [[-1, -1, 2], [-1, 0, 1]] }],
    benchmarkSolution: { timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
    xpReward: 65,
    orderIndex: 2,
  },
  {
    id: '30000000-0000-0000-0000-000000000012',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 11,
    title: 'Container With Most Water (LC 11)',
    slug: 'container-with-most-water',
    problemStatement:
      'Given an integer array height where each element represents the height of a vertical line, find two lines that together with the x-axis form a container that holds the most water.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        max_water = max(max_water, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water

height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
print("Max water capacity:", max_area(height))`,
      pseudocode: `ALGORITHM maxArea(height):
    left = 0, right = length - 1, maxWater = 0
    WHILE left < right:
        h = min(height[left], height[right])
        maxWater = max(maxWater, h * (right - left))
        IF height[left] < height[right] THEN left++
        ELSE right--
    RETURN maxWater`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 60,
    orderIndex: 3,
  },
  {
    id: '30000000-0000-0000-0000-000000000013',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Hard',
    lcNumber: 42,
    title: 'Trapping Rain Water (LC 42)',
    slug: 'trapping-rain-water',
    problemStatement:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def trap(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water

height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
print("Trapped water units:", trap(height))`,
      pseudocode: `ALGORITHM trap(height):
    left = 0, right = length - 1
    leftMax = height[0], rightMax = height[right], water = 0
    WHILE left < right:
        IF leftMax < rightMax THEN
            left++
            leftMax = max(leftMax, height[left])
            water += leftMax - height[left]
        ELSE
            right--
            rightMax = max(rightMax, height[right])
            water += rightMax - height[right]
    RETURN water`,
    },
    initialVisualState: { type: 'ARRAY', elements: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 90,
    orderIndex: 4,
  },
  {
    id: '30000000-0000-0000-0000-000000000014',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Easy',
    lcNumber: 283,
    title: 'Move Zeroes to End (LC 283)',
    slug: 'move-zeroes',
    problemStatement:
      'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements in-place.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def move_zeroes(nums: list[int]) -> list[int]:
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
    return nums

nums = [0, 1, 0, 3, 12]
print(move_zeroes(nums))`,
      pseudocode: `ALGORITHM moveZeroes(nums):
    slow = 0
    FOR fast = 0 TO length(nums) - 1:
        IF nums[fast] != 0 THEN
            SWAP nums[slow], nums[fast]
            slow++
    RETURN nums`,
    },
    initialVisualState: { type: 'ARRAY', elements: [0, 1, 0, 3, 12] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 5,
  },
  {
    id: '30000000-0000-0000-0000-000000000015',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 75,
    title: 'Sort Colors: Dutch National Flag (LC 75)',
    slug: 'sort-colors-dutch-flag',
    problemStatement:
      'Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent in order 0, 1, 2.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def sort_colors(nums: list[int]) -> list[int]:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums

nums = [2, 0, 2, 1, 1, 0]
print(sort_colors(nums))`,
      pseudocode: `ALGORITHM sortColors(nums):
    low = 0, mid = 0, high = length - 1
    WHILE mid <= high:
        IF nums[mid] == 0 THEN SWAP(low, mid); low++; mid++
        ELSE IF nums[mid] == 1 THEN mid++
        ELSE SWAP(mid, high); high--`,
    },
    initialVisualState: { type: 'ARRAY', elements: [2, 0, 2, 1, 1, 0] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 55,
    orderIndex: 6,
  },
  {
    id: '30000000-0000-0000-0000-000000000016',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Easy',
    lcNumber: 26,
    title: 'Remove Duplicates from Sorted Array (LC 26)',
    slug: 'remove-duplicates-sorted',
    problemStatement:
      'Given an integer array nums sorted in non-decreasing order, remove duplicates in-place such that each unique element appears only once.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def remove_duplicates(nums: list[int]) -> int:
    if not nums: return 0
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[k] = nums[i]
            k += 1
    return k

nums = [1, 1, 2, 2, 3, 4, 4]
k = remove_duplicates(nums)
print(f"Unique count: {k}, Array: {nums[:k]}")`,
      pseudocode: `ALGORITHM removeDuplicates(nums):
    k = 1
    FOR i = 1 TO length(nums) - 1:
        IF nums[i] != nums[i - 1] THEN
            nums[k] = nums[i]
            k++
    RETURN k`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 1, 2, 2, 3, 4, 4] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 7,
  },
  {
    id: '30000000-0000-0000-0000-000000000017',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Easy',
    lcNumber: 88,
    title: 'Merge Sorted Array (LC 88)',
    slug: 'merge-sorted-array',
    problemStatement:
      'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 in-place.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> list[int]:
    p1, p2, p = m - 1, n - 1, m + n - 1
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
    return nums1

nums1 = [1, 2, 3, 0, 0, 0]
nums2 = [2, 5, 6]
print(merge(nums1, 3, nums2, 3))`,
      pseudocode: `ALGORITHM merge(nums1, m, nums2, n):
    p1 = m - 1, p2 = n - 1, p = m + n - 1
    WHILE p2 >= 0:
        IF p1 >= 0 AND nums1[p1] > nums2[p2] THEN
            nums1[p] = nums1[p1]; p1--
        ELSE
            nums1[p] = nums2[p2]; p2--
        p--`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 2, 3, 2, 5, 6] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m+n)', spaceComplexity: 'O(1)' },
    xpReward: 45,
    orderIndex: 8,
  },

  // ── 2. SLIDING WINDOW & SUBARRAYS ──
  {
    id: '30000000-0000-0000-0000-000000000004',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sliding-window',
    difficultyTag: 'Easy',
    title: 'Sliding Window: Maximum Sum Subarray (k)',
    slug: 'sliding-window-sum',
    problemStatement:
      'Given an array of integers and a number k, find the maximum sum of any contiguous subarray of size k.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def max_sub_array_sum(arr: list[int], k: int) -> int:
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(len(arr) - k):
        window_sum = window_sum - arr[i] + arr[i + k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
k = 3
print("Max sum of window 3:", max_sub_array_sum(arr, k))`,
      pseudocode: `ALGORITHM maxSubArraySum(arr, k):
    windowSum = sum(arr[0..k-1])
    maxSum = windowSum
    FOR i = 0 TO length(arr) - k - 1:
        windowSum = windowSum - arr[i] + arr[i + k]
        maxSum = max(maxSum, windowSum)
    RETURN maxSum`,
    },
    initialVisualState: { type: 'ARRAY', elements: [2, 1, 5, 1, 3, 2], k: 3 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 9,
  },
  {
    id: '30000000-0000-0000-0000-000000000018',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sliding-window',
    difficultyTag: 'Medium',
    lcNumber: 3,
    title: 'Longest Substring Without Repeating Characters (LC 3)',
    slug: 'longest-unique-substring',
    problemStatement:
      'Given a string s, find the length of the longest substring without repeating characters.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right in range(len(s)):
        if s[right] in char_map and char_map[s[right]] >= left:
            left = char_map[s[right]] + 1
        char_map[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len

s = "abcabcbb"
print(length_of_longest_substring(s))`,
      pseudocode: `ALGORITHM lengthOfLongestSubstring(s):
    charMap = {}
    left = 0, maxLen = 0
    FOR right = 0 TO length(s) - 1:
        IF s[right] IN charMap AND charMap[s[right]] >= left THEN
            left = charMap[s[right]] + 1
        charMap[s[right]] = right
        maxLen = max(maxLen, right - left + 1)
    RETURN maxLen`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 2, 3, 1, 2, 3, 2, 2] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(min(n, m))' },
    xpReward: 65,
    orderIndex: 10,
  },
  {
    id: '30000000-0000-0000-0000-000000000019',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sliding-window',
    difficultyTag: 'Hard',
    lcNumber: 76,
    title: 'Minimum Window Substring (LC 76)',
    slug: 'minimum-window-substring',
    problemStatement:
      'Given two strings s and t of lengths m and n, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def min_window(s: str, t: str) -> str:
    from collections import Counter
    if not t or not s: return ""
    target_counts = Counter(t)
    required = len(target_counts)
    l = 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None
    for r in range(len(s)):
        c = s[r]
        window_counts[c] = window_counts.get(c, 0) + 1
        if c in target_counts and window_counts[c] == target_counts[c]:
            formed += 1
        while l <= r and formed == required:
            if r - l + 1 < ans[0]:
                ans = (r - l + 1, l, r)
            window_counts[s[l]] -= 1
            if s[l] in target_counts and window_counts[s[l]] < target_counts[s[l]]:
                formed -= 1
            l += 1
    return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]

s = "ADOBECODEBANC"
t = "ABC"
print(min_window(s, t))`,
      pseudocode: `ALGORITHM minWindow(s, t):
    countT = frequencyMap(t)
    left = 0, formed = 0, minLen = INF
    FOR right = 0 TO length(s) - 1:
        add s[right] to window
        WHILE window satisfies countT:
            update minLen
            shrink from left++`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 4, 15, 2, 5, 3, 15, 4, 5, 2, 1, 14, 3] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m+n)', spaceComplexity: 'O(m+n)' },
    xpReward: 95,
    orderIndex: 11,
  },
  {
    id: '30000000-0000-0000-0000-000000000020',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sliding-window',
    difficultyTag: 'Easy',
    lcNumber: 485,
    title: 'Max Consecutive Ones (LC 485)',
    slug: 'max-consecutive-ones',
    problemStatement:
      'Given a binary array nums, return the maximum number of consecutive 1s in the array.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def find_max_consecutive_ones(nums: list[int]) -> int:
    max_count = 0
    curr_count = 0
    for n in nums:
        if n == 1:
            curr_count += 1
            max_count = max(max_count, curr_count)
        else:
            curr_count = 0
    return max_count

nums = [1, 1, 0, 1, 1, 1]
print(find_max_consecutive_ones(nums))`,
      pseudocode: `ALGORITHM maxConsecutiveOnes(nums):
    maxCount = 0, curr = 0
    FOR each n in nums:
        IF n == 1 THEN curr++; maxCount = max(maxCount, curr)
        ELSE curr = 0
    RETURN maxCount`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 1, 0, 1, 1, 1] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 12,
  },

  // ── 3. PREFIX SUM & KADANE'S ──
  {
    id: '30000000-0000-0000-0000-000000000021',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 53,
    title: "Maximum Subarray: Kadane's Algorithm (LC 53)",
    slug: 'maximum-subarray-kadane',
    problemStatement:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum in linear O(n) runtime.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def max_sub_array(nums: list[int]) -> int:
    max_so_far = nums[0]
    current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    return max_so_far

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print("Maximum Subarray Sum:", max_sub_array(nums))`,
      pseudocode: `ALGORITHM kadaneMaxSubarray(nums):
    maxSoFar = nums[0]
    curr = nums[0]
    FOR i = 1 TO length(nums) - 1:
        curr = max(nums[i], curr + nums[i])
        maxSoFar = max(maxSoFar, curr)
    RETURN maxSoFar`,
    },
    initialVisualState: { type: 'ARRAY', elements: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 55,
    orderIndex: 13,
  },
  {
    id: '30000000-0000-0000-0000-000000000022',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 238,
    title: 'Product of Array Except Self (LC 238)',
    slug: 'product-array-except-self',
    problemStatement:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i] without using the division operator in O(n).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
    return res

nums = [1, 2, 3, 4]
print(product_except_self(nums))`,
      pseudocode: `ALGORITHM productExceptSelf(nums):
    n = length(nums), res = array of 1s
    prefix = 1
    FOR i = 0 TO n-1: res[i] = prefix; prefix *= nums[i]
    postfix = 1
    FOR i = n-1 DOWN TO 0: res[i] *= postfix; postfix *= nums[i]
    RETURN res`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 2, 3, 4] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 60,
    orderIndex: 14,
  },

  // ── 4. LINKED LISTS ──
  {
    id: '30000000-0000-0000-0000-000000000023',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Easy',
    lcNumber: 206,
    title: 'Reverse Linked List (LC 206)',
    slug: 'reverse-linked-list',
    problemStatement:
      'Given the head of a singly linked list, reverse the list, and return the reversed list. Visualize how pointers are redirected.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Visualizer Node Sequence: [1] -> [2] -> [3] -> [4] -> [5]`,
      javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr !== null) {
        let nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
      pseudocode: `ALGORITHM reverseLinkedList(head):
    prev = NULL
    curr = head
    WHILE curr != NULL:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    RETURN prev`,
    },
    initialVisualState: {
      type: 'LINKED_LIST',
      elements: [1, 2, 3, 4, 5],
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 15,
  },
  {
    id: '30000000-0000-0000-0000-000000000024',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Easy',
    lcNumber: 141,
    title: "Linked List Cycle Detection: Floyd's Tortoise & Hare (LC 141)",
    slug: 'linked-list-cycle',
    problemStatement:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it using two pointers (slow and fast) with O(1) memory.",
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      pseudocode: `ALGORITHM hasCycle(head):
    slow = head, fast = head
    WHILE fast != NULL AND fast.next != NULL:
        slow = slow.next
        fast = fast.next.next
        IF slow == fast THEN RETURN TRUE
    RETURN FALSE`,
    },
    initialVisualState: {
      type: 'LINKED_LIST',
      elements: [3, 2, 0, -4],
      hasCycle: true,
      cycleTargetIndex: 1,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 55,
    orderIndex: 16,
  },
  {
    id: '30000000-0000-0000-0000-000000000025',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Easy',
    lcNumber: 21,
    title: 'Merge Two Sorted Lists (LC 21)',
    slug: 'merge-two-sorted-lists',
    problemStatement:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val < l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`,
      pseudocode: `ALGORITHM mergeTwoLists(l1, l2):
    dummy = Node(0), tail = dummy
    WHILE l1 != NULL AND l2 != NULL:
        IF l1.val < l2.val THEN tail.next = l1; l1 = l1.next
        ELSE tail.next = l2; l2 = l2.next
        tail = tail.next
    tail.next = l1 OR l2
    RETURN dummy.next`,
    },
    initialVisualState: { type: 'LINKED_LIST', elements: [1, 2, 4, 1, 3, 4] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n+m)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 17,
  },
  {
    id: '30000000-0000-0000-0000-000000000026',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Easy',
    lcNumber: 876,
    title: 'Middle of the Linked List (LC 876)',
    slug: 'middle-of-linked-list',
    problemStatement:
      'Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def middle_node(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      pseudocode: `ALGORITHM middleNode(head):
    slow = head, fast = head
    WHILE fast != NULL AND fast.next != NULL:
        slow = slow.next
        fast = fast.next.next
    RETURN slow`,
    },
    initialVisualState: { type: 'LINKED_LIST', elements: [1, 2, 3, 4, 5] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 18,
  },
  {
    id: '30000000-0000-0000-0000-000000000027',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Medium',
    lcNumber: 19,
    title: 'Remove Nth Node From End of List (LC 19)',
    slug: 'remove-nth-node-from-end',
    problemStatement:
      'Given the head of a linked list, remove the nth node from the end of the list and return its head in one pass.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def remove_nth_from_end(head, n: int):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
      pseudocode: `ALGORITHM removeNthFromEnd(head, n):
    fast = head, slow = head
    Advance fast n steps ahead
    WHILE fast.next != NULL:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    RETURN head`,
    },
    initialVisualState: { type: 'LINKED_LIST', elements: [1, 2, 3, 4, 5], n: 2 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 60,
    orderIndex: 19,
  },

  // ── 5. STACKS & QUEUES ──
  {
    id: '30000000-0000-0000-0000-000000000028',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'stacks-queues',
    difficultyTag: 'Easy',
    lcNumber: 20,
    title: 'Valid Parentheses: Stack Matching (LC 20)',
    slug: 'valid-parentheses',
    problemStatement:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid using a LIFO stack.",
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

s = "()[]{}"
print("Is Valid:", is_valid(s))`,
      pseudocode: `ALGORITHM isValidParentheses(s):
    stack = EMPTY_STACK
    FOR each char in s:
        IF char is opening bracket THEN
            PUSH(stack, char)
        ELSE
            IF stack is EMPTY OR TOP(stack) does not match THEN
                RETURN FALSE
            POP(stack)
    RETURN stack is EMPTY`,
    },
    initialVisualState: { type: 'STACK', elements: ['(', ')', '[', ']', '{', '}'] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 45,
    orderIndex: 20,
  },
  {
    id: '30000000-0000-0000-0000-000000000029',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'stacks-queues',
    difficultyTag: 'Medium',
    lcNumber: 739,
    title: 'Daily Temperatures: Monotonic Stack (LC 739)',
    slug: 'daily-temperatures',
    problemStatement:
      'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = [] # stores indices
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev_i = stack.pop()
            ans[prev_i] = i - prev_i
        stack.append(i)
    return ans

temps = [73, 74, 75, 71, 69, 72, 76, 73]
print(daily_temperatures(temps))`,
      pseudocode: `ALGORITHM dailyTemperatures(temps):
    stack = EMPTY_STACK, ans = array of 0s
    FOR i = 0 TO length(temps) - 1:
        WHILE stack NOT EMPTY AND temps[TOP(stack)] < temps[i]:
            prev = POP(stack)
            ans[prev] = i - prev
        PUSH(stack, i)
    RETURN ans`,
    },
    initialVisualState: { type: 'STACK', elements: [73, 74, 75, 71, 69, 72, 76, 73] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 65,
    orderIndex: 21,
  },
  {
    id: '30000000-0000-0000-0000-000000000030',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'stacks-queues',
    difficultyTag: 'Medium',
    lcNumber: 155,
    title: 'Min Stack with O(1) Retrieval (LC 155)',
    slug: 'min-stack',
    problemStatement:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def get_min(self) -> int:
        return self.min_stack[-1]`,
      pseudocode: `ALGORITHM MinStack:
    Maintain primaryStack and minStack
    PUSH(val): push to primaryStack; push min(val, top(minStack)) to minStack
    POP(): pop from both stacks
    GET_MIN(): return top(minStack)`,
    },
    initialVisualState: { type: 'STACK', elements: [-2, 0, -3] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(1)', spaceComplexity: 'O(n)' },
    xpReward: 55,
    orderIndex: 22,
  },

  // ── 6. BINARY TREES ──
  {
    id: '30000000-0000-0000-0000-000000000031',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Easy',
    lcNumber: 226,
    title: 'Invert Binary Tree (LC 226)',
    slug: 'invert-binary-tree',
    problemStatement:
      'Given the root of a binary tree, invert the tree (swap left and right subtrees recursively), and return its root.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

# Tree Node Hierarchy: [4, [2, 1, 3], [7, 6, 9]]`,
      pseudocode: `ALGORITHM invertTree(node):
    IF node == NULL THEN RETURN NULL
    temp = invertTree(node.left)
    node.left = invertTree(node.right)
    node.right = temp
    RETURN node`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [4, 2, 7, 1, 3, 6, 9],
      rootVal: 4,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 45,
    orderIndex: 23,
  },
  {
    id: '30000000-0000-0000-0000-000000000032',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Easy',
    lcNumber: 104,
    title: 'Maximum Depth of Binary Tree (LC 104)',
    slug: 'max-depth-binary-tree',
    problemStatement:
      'Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from the root node down to the farthest leaf node).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      pseudocode: `ALGORITHM maxDepth(root):
    IF root == NULL THEN RETURN 0
    RETURN 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [3, 9, 20, null, null, 15, 7],
      rootVal: 3,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 40,
    orderIndex: 24,
  },
  {
    id: '30000000-0000-0000-0000-000000000033',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Medium',
    lcNumber: 98,
    title: 'Validate Binary Search Tree (LC 98)',
    slug: 'validate-binary-search-tree',
    problemStatement:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST). Left subtree contains strictly less values, right strictly greater.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def is_valid_bst(root) -> bool:
    def validate(node, low=-float('inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root)`,
      pseudocode: `ALGORITHM isValidBST(root):
    FUNCTION check(node, minBound, maxBound):
        IF node == NULL THEN RETURN TRUE
        IF node.val <= minBound OR node.val >= maxBound THEN RETURN FALSE
        RETURN check(node.left, minBound, node.val) AND check(node.right, node.val, maxBound)
    RETURN check(root, -INF, +INF)`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [5, 1, 4, null, null, 3, 6],
      rootVal: 5,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 65,
    orderIndex: 25,
  },
  {
    id: '30000000-0000-0000-0000-000000000034',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Medium',
    lcNumber: 102,
    title: 'Binary Tree Level Order Traversal: BFS (LC 102)',
    slug: 'binary-tree-level-order',
    problemStatement:
      'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level) using a FIFO queue.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `from collections import deque

def level_order(root):
    if not root: return []
    res = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
      pseudocode: `ALGORITHM levelOrderBFS(root):
    IF root == NULL THEN RETURN []
    queue = [root], result = []
    WHILE queue is not empty:
        level = []
        FOR count of elements in queue:
            node = DEQUEUE(queue)
            level.append(node.val)
            IF node.left THEN ENQUEUE(node.left)
            IF node.right THEN ENQUEUE(node.right)
        result.append(level)
    RETURN result`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [3, 9, 20, null, null, 15, 7],
      rootVal: 3,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 60,
    orderIndex: 26,
  },
  {
    id: '30000000-0000-0000-0000-000000000035',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Medium',
    lcNumber: 236,
    title: 'Lowest Common Ancestor of a Binary Tree (LC 236)',
    slug: 'lowest-common-ancestor',
    problemStatement:
      'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right`,
      pseudocode: `ALGORITHM LCA(root, p, q):
    IF root == NULL OR root == p OR root == q THEN RETURN root
    left = LCA(root.left, p, q)
    right = LCA(root.right, p, q)
    IF left != NULL AND right != NULL THEN RETURN root
    RETURN left OR right`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [3, 5, 1, 6, 2, 0, 8],
      rootVal: 3,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 70,
    orderIndex: 27,
  },

  // ── 7. GRAPHS ──
  {
    id: '30000000-0000-0000-0000-000000000036',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'graphs',
    difficultyTag: 'Medium',
    lcNumber: 200,
    title: 'Number of Islands: 2D Grid DFS (LC 200)',
    slug: 'number-of-islands',
    problemStatement:
      "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0' # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    return islands`,
      pseudocode: `ALGORITHM numberOfIslands(grid):
    islands = 0
    FOR each cell (r, c):
        IF grid[r][c] == '1' THEN
            floodFill_DFS(r, c)
            islands++
    RETURN islands`,
    },
    initialVisualState: {
      type: 'GRAPH',
      elements: [
        ['1', '1', '0', '0'],
        ['1', '1', '0', '0'],
        ['0', '0', '1', '0'],
        ['0', '0', '0', '1'],
      ],
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)' },
    xpReward: 70,
    orderIndex: 28,
  },
  {
    id: '30000000-0000-0000-0000-000000000037',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'graphs',
    difficultyTag: 'Medium',
    lcNumber: 207,
    title: "Course Schedule: Cycle Detection in Directed Graph (LC 207)",
    slug: 'course-schedule-cycle',
    problemStatement:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses using topological sort / cycle detection.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def can_finish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = {i: [] for i in range(numCourses)}
    for crs, pre in prerequisites:
        adj[crs].append(pre)
    visited = set()

    def dfs(crs):
        if crs in visited: return False
        if adj[crs] == []: return True
        visited.add(crs)
        for pre in adj[crs]:
            if not dfs(pre): return False
        visited.remove(crs)
        adj[crs] = []
        return True

    for c in range(numCourses):
        if not dfs(c): return False
    return True`,
      pseudocode: `ALGORITHM canFinishCourses(n, prerequisites):
    Build adjacency list and in-degrees
    Apply Kahn's Algorithm / Topological Sort via queue
    RETURN visitedCount == n`,
    },
    initialVisualState: {
      type: 'GRAPH',
      nodes: [0, 1, 2, 3],
      edges: [[0, 1], [1, 2], [2, 3]],
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V + E)' },
    xpReward: 75,
    orderIndex: 29,
  },
  {
    id: '30000000-0000-0000-0000-000000000038',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'graphs',
    difficultyTag: 'Medium',
    title: "Dijkstra's Shortest Path Algorithm",
    slug: 'dijkstras-shortest-path',
    problemStatement:
      'Given a weighted connected graph with non-negative edge weights, compute the shortest path distance from a source vertex to all other vertices using a min-heap priority queue.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `import heapq

def dijkstra(n, edges, src):
    adj = {i: [] for i in range(n)}
    for u, v, w in edges:
        adj[u].append((v, w))
    min_heap = [(0, src)]
    dist = {i: float('inf') for i in range(n)}
    dist[src] = 0

    while min_heap:
        d, u = heapq.heappop(min_heap)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(min_heap, (dist[v], v))
    return dist`,
      pseudocode: `ALGORITHM dijkstra(graph, source):
    dist = map all to INF, dist[source] = 0
    priorityQueue = [(0, source)]
    WHILE priorityQueue NOT EMPTY:
        currDist, u = EXTRACT_MIN(priorityQueue)
        FOR each neighbor (v, weight) of u:
            IF dist[u] + weight < dist[v] THEN
                dist[v] = dist[u] + weight
                INSERT(priorityQueue, (dist[v], v))
    RETURN dist`,
    },
    initialVisualState: {
      type: 'GRAPH',
      nodes: [0, 1, 2, 3],
      edges: [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1]],
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)' },
    xpReward: 85,
    orderIndex: 30,
  },

  // ── 8. DYNAMIC PROGRAMMING (DP) ──
  {
    id: '30000000-0000-0000-0000-000000000039',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Easy',
    lcNumber: 70,
    title: 'Climbing Stairs: Fibonacci DP (LC 70)',
    slug: 'climbing-stairs-dp',
    problemStatement:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def climb_stairs(n: int) -> int:
    if n <= 2: return n
    one, two = 1, 2
    for _ in range(3, n + 1):
        one, two = two, one + two
    return two

n = 5
print(f"Ways to climb {n} stairs: {climb_stairs(n)}")`,
      pseudocode: `ALGORITHM climbStairs(n):
    IF n <= 2 THEN RETURN n
    dp = array of size n + 1
    dp[1] = 1, dp[2] = 2
    FOR i = 3 TO n:
        dp[i] = dp[i - 1] + dp[i - 2]
    RETURN dp[n]`,
    },
    initialVisualState: { type: 'DP_TABLE', elements: [0, 1, 2, 3, 5, 8], target: 5 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 31,
  },
  {
    id: '30000000-0000-0000-0000-000000000040',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    lcNumber: 322,
    title: 'Coin Change: Minimum Coins DP (LC 322)',
    slug: 'coin-change-dp',
    problemStatement:
      'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != float('inf') else -1

coins = [1, 2, 5]
amount = 11
print("Min coins for 11:", coin_change(coins, amount))`,
      pseudocode: `ALGORITHM coinChange(coins, amount):
    dp = array of size amount + 1 initialized to INF
    dp[0] = 0
    FOR a = 1 TO amount:
        FOR each coin in coins:
            IF a >= coin THEN
                dp[a] = min(dp[a], 1 + dp[a - coin])
    RETURN dp[amount] if not INF else -1`,
    },
    initialVisualState: { type: 'DP_TABLE', elements: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3], target: 11 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(amount * coins)', spaceComplexity: 'O(amount)' },
    xpReward: 65,
    orderIndex: 32,
  },
  {
    id: '30000000-0000-0000-0000-000000000041',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    lcNumber: 300,
    title: 'Longest Increasing Subsequence (LC 300)',
    slug: 'longest-increasing-subsequence',
    problemStatement:
      'Given an integer array nums, return the length of the longest strictly increasing subsequence using dynamic programming.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def length_of_lis(nums: list[int]) -> int:
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

nums = [10, 9, 2, 5, 3, 7, 101, 18]
print("LIS Length:", length_of_lis(nums))`,
      pseudocode: `ALGORITHM LIS(nums):
    dp = array of 1s of length(nums)
    FOR i = 1 TO length(nums) - 1:
        FOR j = 0 TO i - 1:
            IF nums[i] > nums[j] THEN
                dp[i] = max(dp[i], dp[j] + 1)
    RETURN max(dp)`,
    },
    initialVisualState: { type: 'ARRAY', elements: [10, 9, 2, 5, 3, 7, 101, 18] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n²)', spaceComplexity: 'O(n)' },
    xpReward: 70,
    orderIndex: 33,
  },
  {
    id: '30000000-0000-0000-0000-000000000042',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    title: '0/1 Knapsack Problem',
    slug: 'knapsack-01-dp',
    problemStatement:
      'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]

val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
print("Max Value:", knapsack(W, wt, val, len(val)))`,
      pseudocode: `ALGORITHM knapsack(W, wt, val, n):
    dp = 2D matrix of size (n+1) x (W+1) initialized to 0
    FOR i = 1 TO n:
        FOR w = 1 TO W:
            IF wt[i-1] <= w THEN
                dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])
            ELSE
                dp[i][w] = dp[i-1][w]
    RETURN dp[n][W]`,
    },
    initialVisualState: { type: 'DP_TABLE', elements: [60, 100, 120], capacity: 50 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n * W)', spaceComplexity: 'O(n * W)' },
    xpReward: 75,
    orderIndex: 34,
  },
  {
    id: '30000000-0000-0000-0000-000000000043',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    lcNumber: 1143,
    title: 'Longest Common Subsequence: LCS (LC 1143)',
    slug: 'longest-common-subsequence',
    problemStatement:
      'Given two strings text1 and text2, return the length of their longest common subsequence using a 2D dynamic programming grid.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(longest_common_subsequence("abcde", "ace"))`,
      pseudocode: `ALGORITHM longestCommonSubsequence(text1, text2):
    dp = 2D matrix (len1+1) x (len2+1)
    FOR i = 1 TO len1:
        FOR j = 1 TO len2:
            IF text1[i-1] == text2[j-1] THEN dp[i][j] = 1 + dp[i-1][j-1]
            ELSE dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    RETURN dp[len1][len2]`,
    },
    initialVisualState: { type: 'DP_TABLE', elements: [1, 2, 3, 4, 5] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)' },
    xpReward: 70,
    orderIndex: 35,
  },
  {
    id: '30000000-0000-0000-0000-000000000044',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    lcNumber: 198,
    title: 'House Robber: Non-Adjacent DP (LC 198)',
    slug: 'house-robber',
    problemStatement:
      'You are planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses cannot be robbed on the same night.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def rob(nums: list[int]) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2

nums = [2, 7, 9, 3, 1]
print("Max Loot:", rob(nums))`,
      pseudocode: `ALGORITHM houseRobber(nums):
    rob1 = 0, rob2 = 0
    FOR each n in nums:
        newRob = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = newRob
    RETURN rob2`,
    },
    initialVisualState: { type: 'ARRAY', elements: [2, 7, 9, 3, 1] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 36,
  },

  // ── 9. SORTING & SEARCHING ──
  {
    id: '30000000-0000-0000-0000-000000000001',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Easy',
    lcNumber: 704,
    title: 'Binary Search on Sorted Array (LC 704)',
    slug: 'binary-search-array',
    problemStatement:
      'Given an array of integers nums sorted in ascending order and an integer target, write a function to search target in nums with O(log n) runtime.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

my_list = [10, 22, 35, 47, 50, 63, 75, 88, 99]
target = 47
print("Found at:", binary_search(my_list, target))`,
      pseudocode: `ALGORITHM binarySearch(arr, target):
    low = 0, high = length(arr) - 1
    WHILE low <= high:
        mid = (low + high) / 2
        IF arr[mid] == target THEN RETURN mid
        ELSE IF arr[mid] < target THEN low = mid + 1
        ELSE high = mid - 1
    RETURN -1`,
    },
    initialVisualState: { type: 'ARRAY', elements: [10, 22, 35, 47, 50, 63, 75, 88, 99], target: 47 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 37,
  },
  {
    id: '30000000-0000-0000-0000-000000000045',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Medium',
    lcNumber: 33,
    title: 'Search in Rotated Sorted Array (LC 33)',
    slug: 'search-in-rotated-sorted-array',
    problemStatement:
      'Given the array nums after possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums in O(log n).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1

nums = [4, 5, 6, 7, 0, 1, 2]
target = 0
print(search(nums, target))`,
      pseudocode: `ALGORITHM searchRotatedArray(nums, target):
    l = 0, r = length - 1
    WHILE l <= r:
        mid = (l + r) / 2
        IF nums[mid] == target THEN RETURN mid
        IF left half sorted THEN
            IF target in range THEN r = mid - 1 ELSE l = mid + 1
        ELSE
            IF target in range THEN l = mid + 1 ELSE r = mid - 1
    RETURN -1`,
    },
    initialVisualState: { type: 'ARRAY', elements: [4, 5, 6, 7, 0, 1, 2], target: 0 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
    xpReward: 65,
    orderIndex: 38,
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Easy',
    title: 'Bubble Sort: Animated Step-by-Step Swaps',
    slug: 'bubble-sort',
    problemStatement:
      'Given an unsorted array of numbers, sort the array in order using Bubble Sort. Visualize how adjacent inversions are swapped until the array is fully ordered.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

my_list = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(my_list))`,
      pseudocode: `ALGORITHM bubbleSort(arr):
    n = length(arr)
    FOR i = 0 TO n - 2:
        FOR j = 0 TO n - i - 2:
            IF arr[j] > arr[j + 1] THEN
                SWAP arr[j], arr[j + 1]
    RETURN arr`,
    },
    initialVisualState: { type: 'ARRAY', elements: [64, 34, 25, 12, 22, 11, 90] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
    xpReward: 40,
    orderIndex: 39,
  },
  {
    id: '30000000-0000-0000-0000-000000000046',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Medium',
    title: 'Merge Sort: Divide and Conquer',
    slug: 'merge-sort-algorithm',
    problemStatement:
      'Sort an array of n numbers by recursively dividing the array into halves and merging the sorted subarrays in O(n log n) time.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res

arr = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(arr))`,
      pseudocode: `ALGORITHM mergeSort(arr):
    IF length(arr) <= 1 THEN RETURN arr
    mid = length(arr) / 2
    left = mergeSort(arr[0..mid-1])
    right = mergeSort(arr[mid..end])
    RETURN merge(left, right)`,
    },
    initialVisualState: { type: 'ARRAY', elements: [38, 27, 43, 3, 9, 82, 10] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
    xpReward: 65,
    orderIndex: 40,
  },
  {
    id: '30000000-0000-0000-0000-000000000047',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Medium',
    title: 'Quick Sort: Pivot Partitioning',
    slug: 'quick-sort-algorithm',
    problemStatement:
      'Sort an array using the divide-and-conquer strategy by selecting a pivot element and partitioning the array so smaller elements go left and larger go right.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

arr = [10, 80, 30, 90, 40, 50, 70]
print(quick_sort(arr))`,
      pseudocode: `ALGORITHM quickSort(arr):
    IF length(arr) <= 1 THEN RETURN arr
    pivot = selectPivot(arr)
    partition arr into left (< pivot), equal (== pivot), right (> pivot)
    RETURN quickSort(left) + equal + quickSort(right)`,
    },
    initialVisualState: { type: 'ARRAY', elements: [10, 80, 30, 90, 40, 50, 70] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)' },
    xpReward: 65,
    orderIndex: 41,
  },

  // ── 10. BACKTRACKING & HEAPS ──
  {
    id: '30000000-0000-0000-0000-000000000048',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'backtracking-heaps',
    difficultyTag: 'Medium',
    lcNumber: 78,
    title: 'Subsets: Power Set Generation (LC 78)',
    slug: 'subsets-power-set',
    problemStatement:
      'Given an integer array nums of unique elements, return all possible subsets (the power set) using recursive backtracking.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    subset = []

    def dfs(i):
        if i >= len(nums):
            res.append(subset.copy())
            return
        # Decision to include nums[i]
        subset.append(nums[i])
        dfs(i + 1)
        # Decision not to include nums[i]
        subset.pop()
        dfs(i + 1)

    dfs(0)
    return res

nums = [1, 2, 3]
print(subsets(nums))`,
      pseudocode: `ALGORITHM subsets(nums):
    result = []
    FUNCTION dfs(index, currentSubset):
        IF index >= length(nums) THEN
            result.append(currentSubset)
            RETURN
        dfs(index + 1, currentSubset + [nums[index]]) # INCLUDE
        dfs(index + 1, currentSubset) # EXCLUDE
    dfs(0, [])
    RETURN result`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 2, 3] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n * 2^n)', spaceComplexity: 'O(n)' },
    xpReward: 60,
    orderIndex: 42,
  },
  {
    id: '30000000-0000-0000-0000-000000000049',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'backtracking-heaps',
    difficultyTag: 'Medium',
    lcNumber: 46,
    title: 'Permutations of Array (LC 46)',
    slug: 'permutations-array',
    problemStatement:
      'Given an array nums of distinct integers, return all the possible permutations using recursive backtracking state trees.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def permute(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(start):
        if start == len(nums):
            res.append(nums[:])
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]

    backtrack(0)
    return res

nums = [1, 2, 3]
print(permute(nums))`,
      pseudocode: `ALGORITHM permute(nums):
    result = []
    FUNCTION backtrack(start):
        IF start == length(nums) THEN result.append(copy of nums); RETURN
        FOR i = start TO length(nums) - 1:
            SWAP(nums[start], nums[i])
            backtrack(start + 1)
            SWAP(nums[start], nums[i])
    backtrack(0)
    RETURN result`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 2, 3] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n * n!)', spaceComplexity: 'O(n!)' },
    xpReward: 65,
    orderIndex: 43,
  },
  {
    id: '30000000-0000-0000-0000-000000000050',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'backtracking-heaps',
    difficultyTag: 'Medium',
    lcNumber: 215,
    title: 'Kth Largest Element in an Array (LC 215)',
    slug: 'kth-largest-element-heap',
    problemStatement:
      'Given an integer array nums and an integer k, return the kth largest element in the array using a Min-Heap of size k.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap = []
    for n in nums:
        heapq.heappush(min_heap, n)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

nums = [3, 2, 1, 5, 6, 4]
k = 2
print(f"{k}nd largest element is:", find_kth_largest(nums, k))`,
      pseudocode: `ALGORITHM findKthLargest(nums, k):
    minHeap = EMPTY_MIN_HEAP
    FOR each n in nums:
        PUSH(minHeap, n)
        IF size(minHeap) > k THEN POP(minHeap)
    RETURN TOP(minHeap)`,
    },
    initialVisualState: { type: 'ARRAY', elements: [3, 2, 1, 5, 6, 4], k: 2 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)' },
    xpReward: 60,
    orderIndex: 44,
  },
  {
    id: '30000000-0000-0000-0000-000000000051',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'graphs',
    difficultyTag: 'Medium',
    lcNumber: 994,
    title: 'Rotting Oranges: Multi-Source BFS (LC 994)',
    slug: 'rotting-oranges-bfs',
    problemStatement:
      'You are given an m x n grid where 0 represents an empty cell, 1 represents a fresh orange, and 2 represents a rotten orange. Return the minimum number of minutes that must elapse until no cell has a fresh orange using multi-source BFS.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c))
            elif grid[r][c] == 1: fresh += 1
    time = 0
    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in directions:
                row, col = r + dr, c + dc
                if 0 <= row < rows and 0 <= col < cols and grid[row][col] == 1:
                    grid[row][col] = 2
                    q.append((row, col))
                    fresh -= 1
        time += 1
    return time if fresh == 0 else -1`,
      pseudocode: `ALGORITHM orangesRotting(grid):
    queue = all cells with 2 (rotten)
    freshCount = all cells with 1 (fresh)
    minutes = 0
    WHILE queue NOT EMPTY AND freshCount > 0:
        FOR each rotten orange in current layer:
            infect 4-directionally adjacent fresh oranges
            decrease freshCount; add new rotten to queue
        minutes++
    RETURN minutes IF freshCount == 0 ELSE -1`,
    },
    initialVisualState: {
      type: 'GRAPH',
      elements: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)' },
    xpReward: 75,
    orderIndex: 45,
  },
  {
    id: '30000000-0000-0000-0000-000000000052',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'arrays',
    difficultyTag: 'Medium',
    lcNumber: 560,
    title: 'Subarray Sum Equals K: Prefix HashMap (LC 560)',
    slug: 'subarray-sum-equals-k',
    problemStatement:
      'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k in O(n) time using a prefix sum frequency hash table.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def subarray_sum(nums: list[int], k: int) -> int:
    count = 0
    cur_sum = 0
    prefix_map = {0: 1}
    for n in nums:
        cur_sum += n
        diff = cur_sum - k
        count += prefix_map.get(diff, 0)
        prefix_map[cur_sum] = 1 + prefix_map.get(cur_sum, 0)
    return count

nums = [1, 1, 1]
k = 2
print("Total subarrays:", subarray_sum(nums, k))`,
      pseudocode: `ALGORITHM subarraySum(nums, k):
    prefixMap = {0: 1}
    currSum = 0, count = 0
    FOR each n in nums:
        currSum += n
        count += prefixMap.get(currSum - k, 0)
        prefixMap[currSum] = prefixMap.get(currSum, 0) + 1
    RETURN count`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 1, 1], target: 2 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 65,
    orderIndex: 46,
  },
  {
    id: '30000000-0000-0000-0000-000000000053',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'linked-list',
    difficultyTag: 'Easy',
    lcNumber: 234,
    title: 'Palindrome Linked List (LC 234)',
    slug: 'palindrome-linked-list',
    problemStatement:
      'Given the head of a singly linked list, return true if it is a palindrome or false otherwise in O(n) time and O(1) space.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def is_palindrome(head) -> bool:
    fast = slow = head
    while fast and fast.next:
        fast = fast.next.next
        slow = slow.next
    prev = None
    while slow:
        nxt = slow.next
        slow.next = prev
        prev = slow
        slow = nxt
    left, right = head, prev
    while right:
        if left.val != right.val: return False
        left = left.next
        right = right.next
    return True`,
      pseudocode: `ALGORITHM isPalindromeList(head):
    Find middle via fast/slow pointers
    Reverse second half in-place
    Compare values of first half and second half
    RETURN TRUE if matched, ELSE FALSE`,
    },
    initialVisualState: { type: 'LINKED_LIST', elements: [1, 2, 2, 1] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    xpReward: 50,
    orderIndex: 47,
  },
  {
    id: '30000000-0000-0000-0000-000000000054',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'stacks-queues',
    difficultyTag: 'Medium',
    lcNumber: 150,
    title: 'Evaluate Reverse Polish Notation: RPN (LC 150)',
    slug: 'evaluate-reverse-polish-notation',
    problemStatement:
      'Evaluate the value of an arithmetic expression in Reverse Polish Notation (postfix notation) using a stack.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for c in tokens:
        if c == "+": stack.append(stack.pop() + stack.pop())
        elif c == "-":
            a, b = stack.pop(), stack.pop()
            stack.append(b - a)
        elif c == "*": stack.append(stack.pop() * stack.pop())
        elif c == "/":
            a, b = stack.pop(), stack.pop()
            stack.append(int(b / a))
        else: stack.append(int(c))
    return stack[0]

tokens = ["2", "1", "+", "3", "*"]
print(eval_rpn(tokens))`,
      pseudocode: `ALGORITHM evalRPN(tokens):
    stack = EMPTY_STACK
    FOR each token in tokens:
        IF token is operator (+, -, *, /) THEN
            b = POP(stack), a = POP(stack)
            PUSH(stack, compute(a, op, b))
        ELSE
            PUSH(stack, to_integer(token))
    RETURN TOP(stack)`,
    },
    initialVisualState: { type: 'STACK', elements: [2, 1, 3] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 55,
    orderIndex: 48,
  },
  {
    id: '30000000-0000-0000-0000-000000000055',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Easy',
    lcNumber: 543,
    title: 'Diameter of Binary Tree (LC 543)',
    slug: 'diameter-of-binary-tree',
    problemStatement:
      'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def diameter_of_binary_tree(root) -> int:
    res = 0
    def dfs(curr):
        nonlocal res
        if not curr: return 0
        left = dfs(curr.left)
        right = dfs(curr.right)
        res = max(res, left + right)
        return 1 + max(left, right)
    dfs(root)
    return res`,
      pseudocode: `ALGORITHM treeDiameter(root):
    maxDiameter = 0
    FUNCTION height(node):
        IF node == NULL THEN RETURN 0
        leftH = height(node.left)
        rightH = height(node.right)
        maxDiameter = max(maxDiameter, leftH + rightH)
        RETURN 1 + max(leftH, rightH)
    height(root)
    RETURN maxDiameter`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [1, 2, 3, 4, 5],
      rootVal: 1,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 50,
    orderIndex: 49,
  },
  {
    id: '30000000-0000-0000-0000-000000000056',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'trees',
    difficultyTag: 'Easy',
    lcNumber: 101,
    title: 'Symmetric Tree: Mirror Reflection (LC 101)',
    slug: 'symmetric-tree-mirror',
    problemStatement:
      'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def is_symmetric(root) -> bool:
    def is_mirror(t1, t2):
        if not t1 and not t2: return True
        if not t1 or not t2: return False
        return (t1.val == t2.val and
                is_mirror(t1.right, t2.left) and
                is_mirror(t1.left, t2.right))
    return is_mirror(root, root)`,
      pseudocode: `ALGORITHM isSymmetric(root):
    FUNCTION isMirror(t1, t2):
        IF t1 == NULL AND t2 == NULL THEN RETURN TRUE
        IF t1 == NULL OR t2 == NULL THEN RETURN FALSE
        RETURN (t1.val == t2.val) AND isMirror(t1.left, t2.right) AND isMirror(t1.right, t2.left)
    RETURN isMirror(root, root)`,
    },
    initialVisualState: {
      type: 'TREE',
      elements: [1, 2, 2, 3, 4, 4, 3],
      rootVal: 1,
    },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(h)' },
    xpReward: 45,
    orderIndex: 50,
  },
  {
    id: '30000000-0000-0000-0000-000000000057',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'backtracking-heaps',
    difficultyTag: 'Medium',
    lcNumber: 39,
    title: 'Combination Sum (LC 39)',
    slug: 'combination-sum-backtracking',
    problemStatement:
      'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    res = []
    def dfs(i, cur, total):
        if total == target:
            res.append(cur.copy())
            return
        if i >= len(candidates) or total > target:
            return
        cur.append(candidates[i])
        dfs(i, cur, total + candidates[i])
        cur.pop()
        dfs(i + 1, cur, total)
    dfs(0, [], 0)
    return res

candidates = [2, 3, 6, 7]
target = 7
print(combination_sum(candidates, target))`,
      pseudocode: `ALGORITHM combinationSum(candidates, target):
    result = []
    FUNCTION dfs(i, currentCombination, currentSum):
        IF currentSum == target THEN result.append(copy); RETURN
        IF i >= length OR currentSum > target THEN RETURN
        INCLUDE candidates[i] -> dfs(i, currentCombination, currentSum + candidates[i])
        EXCLUDE candidates[i] -> dfs(i + 1, currentCombination, currentSum)
    dfs(0, [], 0)
    RETURN result`,
    },
    initialVisualState: { type: 'ARRAY', elements: [2, 3, 6, 7], target: 7 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(2^target)', spaceComplexity: 'O(target)' },
    xpReward: 70,
    orderIndex: 51,
  },
  {
    id: '30000000-0000-0000-0000-000000000058',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'backtracking-heaps',
    difficultyTag: 'Medium',
    lcNumber: 347,
    title: 'Top K Frequent Elements: Bucket Sort (LC 347)',
    slug: 'top-k-frequent-elements',
    problemStatement:
      'Given an integer array nums and an integer k, return the k most frequent elements in linear O(n) runtime.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = {}
    freq = [[] for _ in range(len(nums) + 1)]
    for n in nums: count[n] = 1 + count.get(n, 0)
    for n, c in count.items(): freq[c].append(n)
    res = []
    for i in range(len(freq) - 1, 0, -1):
        for n in freq[i]:
            res.append(n)
            if len(res) == k: return res
    return res

nums = [1, 1, 1, 2, 2, 3]
k = 2
print(top_k_frequent(nums, k))`,
      pseudocode: `ALGORITHM topKFrequent(nums, k):
    countMap = frequency map of nums
    buckets = array of lists indexed by frequency
    res = []
    FOR freq from length(nums) DOWN TO 1:
        FOR each num in buckets[freq]:
            res.append(num)
            IF length(res) == k THEN RETURN res`,
    },
    initialVisualState: { type: 'ARRAY', elements: [1, 1, 1, 2, 2, 3], k: 2 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    xpReward: 65,
    orderIndex: 52,
  },
  {
    id: '30000000-0000-0000-0000-000000000059',
    moduleId: '20000000-0000-0000-0000-000000000001',
    category: 'sorting-searching',
    difficultyTag: 'Medium',
    lcNumber: 153,
    title: 'Find Minimum in Rotated Sorted Array (LC 153)',
    slug: 'find-min-rotated-sorted-array',
    problemStatement:
      'Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time using modified binary search.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def find_min(nums: list[int]) -> int:
    res = nums[0]
    l, r = 0, len(nums) - 1
    while l <= r:
        if nums[l] < nums[r]:
            res = min(res, nums[l])
            break
        m = (l + r) // 2
        res = min(res, nums[m])
        if nums[m] >= nums[l]:
            l = m + 1
        else:
            r = m - 1
    return res

nums = [3, 4, 5, 1, 2]
print("Minimum in rotated array:", find_min(nums))`,
      pseudocode: `ALGORITHM findMinRotated(nums):
    l = 0, r = length - 1
    minVal = nums[0]
    WHILE l <= r:
        IF nums[l] < nums[r] THEN minVal = min(minVal, nums[l]); BREAK
        m = (l + r) / 2
        minVal = min(minVal, nums[m])
        IF nums[m] >= nums[l] THEN l = m + 1
        ELSE r = m - 1
    RETURN minVal`,
    },
    initialVisualState: { type: 'ARRAY', elements: [3, 4, 5, 1, 2] },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
    xpReward: 55,
    orderIndex: 53,
  },
  {
    id: '30000000-0000-0000-0000-000000000060',
    moduleId: '20000000-0000-0000-0000-000000000002',
    category: 'dp',
    difficultyTag: 'Medium',
    lcNumber: 62,
    title: 'Unique Paths in Grid (LC 62)',
    slug: 'unique-paths-dp',
    problemStatement:
      'There is a robot on an m x n grid. The robot can only move either down or right. Return the number of possible unique paths to reach the bottom-right corner.',
    challengeType: 'dsa_algo',
    starterCode: {
      python: `def unique_paths(m: int, n: int) -> int:
    row = [1] * n
    for i in range(m - 1):
        new_row = [1] * n
        for j in range(n - 2, -1, -1):
            new_row[j] = new_row[j + 1] + row[j]
        row = new_row
    return row[0]

print("Unique Paths (3x7):", unique_paths(3, 7))`,
      pseudocode: `ALGORITHM uniquePaths(m, n):
    dp = 2D grid of size m x n initialized to 1
    FOR i = 1 TO m - 1:
        FOR j = 1 TO n - 1:
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    RETURN dp[m-1][n-1]`,
    },
    initialVisualState: { type: 'DP_TABLE', elements: [1, 1, 1, 1, 2, 3, 4], m: 3, n: 7 },
    testCases: [],
    benchmarkSolution: { timeComplexity: 'O(m*n)', spaceComplexity: 'O(n)' },
    xpReward: 60,
    orderIndex: 54,
  },
];
