import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Minus, Calculator } from 'lucide-react';

interface CourseCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onAddToCart: (item: any) => void;
}

const CourseCustomizationModal: React.FC<CourseCustomizationModalProps> = ({
  isOpen,
  onClose,
  course,
  onAddToCart
}) => {
  const [grade, setGrade] = useState('');
  const [duration, setDuration] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Identify special programs
  const isMiddleSchoolMath = course?.id === 'middle-school-math';
  const isElementaryMath = course?.id === 'elementary-math';
  const isAlgebra = course?.id === 'algebra-1' || course?.id === 'algebra-2';
  const isGrammarBoost = course?.id === 'grammar-boost-k-8';
  const isReadingEnrichment = course?.id === 'reading-enrichment-k-5';
  // Courses that hide grade selection (fixed-duration only requires duration)
  const hideGradeForCourse =
    course?.id === 'math-course-1-2' ||
    course?.id === 'math-course-3' ||
    course?.id === 'math-integrated-1' ||
    course?.id === 'math-integrated-2' ||
    isAlgebra;
  // These courses use fixed 4/12/24 week options
  const hasFixedDurationOptions =
    isElementaryMath || isMiddleSchoolMath || hideGradeForCourse || isAlgebra;

  // Reset selections each time modal opens or course changes
  useEffect(() => {
    if (isOpen) {
      setGrade('');
      setDuration('');
      setQuantity(1);
    }
  }, [isOpen, course?.id]);

  const handleAddToCart = () => {
  const composedName = hideGradeForCourse
      ? `${course.name} - ${duration}`
      : `${course.name} - ${grade} - ${duration}`;

    const cartItem = {
      id: `${course.id}-${grade || 'na'}-${duration}`,
      name: composedName,
      price: calculatePrice(),
      quantity,
      image: course.image,
      category: course.category || 'Course',
      type: 'course',
      duration,
      level: grade || course.level
    };

    onAddToCart(cartItem);
    onClose();
  };

  const calculatePrice = () => {
    // Reading Enrichment K-5 pricing: 4 weeks $216, 12 weeks $648
    if (isReadingEnrichment && duration) {
      const map: { [k: string]: number } = { '4 weeks': 216, '12 weeks': 648 };
      return map[duration] ?? 216;
    }

    // Grammar Boost K-8 has grade- and duration-based pricing
    if (isGrammarBoost && grade && duration) {
      const isKto6 = grade === 'K' || grade === 'Grade 1' || grade === 'Grade 2' || grade === 'Grade 3' || grade === 'Grade 4' || grade === 'Grade 5' || grade === 'Grade 6';
      const is7to8 = grade === 'Grade 7' || grade === 'Grade 8';
      if (duration === '4 weeks') {
        if (isKto6) return 216;
        if (is7to8) return 240;
      }
      if (duration === '8 weeks') {
        // K-5 -> $432, 6-8 -> $480
        const isKto5 = grade === 'K' || grade === 'Grade 1' || grade === 'Grade 2' || grade === 'Grade 3' || grade === 'Grade 4' || grade === 'Grade 5';
        if (isKto5) return 432;
        return 480; // Grade 6, 7, 8
      }
    }

    // Fixed pricing for Elementary, Middle, Algebra, and specific Math Courses
    if (hasFixedDurationOptions && duration) {
      // Algebra has a different price map
      if (isAlgebra) {
        const algebraPricing: { [k: string]: number } = {
          '4 weeks': 360,
          '12 weeks': 1080,
          '24 weeks': 1160
        };
        return algebraPricing[duration] ?? 360;
      }

      const pricingMap: { [k: string]: number } = {
        '4 weeks': 280,
        '12 weeks': 840,
        '24 weeks': 1280
      };
      return pricingMap[duration] ?? 280;
    }

    // Default pricing fallback
    let basePrice = course.price || 100;
    if (grade === 'High School') basePrice *= 1.2;
    if (duration === 'Extended') basePrice *= 1.5;
    return Math.round(basePrice);
  };

  const totalPrice = calculatePrice() * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Customize Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{course.description}</p>
          </div>

          {/* Grade Selection (hidden only for specified courses) */}
          {!hideGradeForCourse && (
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {isReadingEnrichment ? (
                    <>
                      <SelectItem value="K">Kindergarten (K)</SelectItem>
                      <SelectItem value="Grade 1">Grade 1</SelectItem>
                      <SelectItem value="Grade 2">Grade 2</SelectItem>
                      <SelectItem value="Grade 3">Grade 3</SelectItem>
                      <SelectItem value="Grade 4">Grade 4</SelectItem>
                      <SelectItem value="Grade 5">Grade 5</SelectItem>
                    </>
                  ) : isGrammarBoost ? (
                    <>
                      <SelectItem value="K">Kindergarten (K)</SelectItem>
                      <SelectItem value="Grade 1">Grade 1</SelectItem>
                      <SelectItem value="Grade 2">Grade 2</SelectItem>
                      <SelectItem value="Grade 3">Grade 3</SelectItem>
                      <SelectItem value="Grade 4">Grade 4</SelectItem>
                      <SelectItem value="Grade 5">Grade 5</SelectItem>
                      <SelectItem value="Grade 6">Grade 6</SelectItem>
                      <SelectItem value="Grade 7">Grade 7</SelectItem>
                      <SelectItem value="Grade 8">Grade 8</SelectItem>
                    </>
                  ) : isElementaryMath ? (
                    <>
                      <SelectItem value="Grade 1">Grade 1</SelectItem>
                      <SelectItem value="Grade 2">Grade 2</SelectItem>
                      <SelectItem value="Grade 3">Grade 3</SelectItem>
                      <SelectItem value="Grade 4">Grade 4</SelectItem>
                      <SelectItem value="Grade 5">Grade 5</SelectItem>
                    </>
                  ) : isMiddleSchoolMath ? (
                    <>
                      <SelectItem value="Grade 6">Grade 6</SelectItem>
                      <SelectItem value="Grade 7">Grade 7</SelectItem>
                      <SelectItem value="Grade 8">Grade 8</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Elementary">Elementary (K-5)</SelectItem>
                      <SelectItem value="Middle School">Middle School (6-8)</SelectItem>
                      <SelectItem value="High School">High School (9-12)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Program Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {isReadingEnrichment ? (
                  <>
                    <SelectItem value="4 weeks">4 weeks</SelectItem>
                    <SelectItem value="12 weeks">12 weeks</SelectItem>
                  </>
                ) : isGrammarBoost ? (
                  <>
                    <SelectItem value="4 weeks">4 weeks</SelectItem>
                    <SelectItem value="8 weeks">8 weeks</SelectItem>
                  </>
                ) : hasFixedDurationOptions ? (
                  <>
                    <SelectItem value="4 weeks">4 weeks</SelectItem>
                    <SelectItem value="12 weeks">12 weeks</SelectItem>
                    <SelectItem value="24 weeks">24 weeks</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Standard">Standard (12 weeks)</SelectItem>
                    <SelectItem value="Extended">Extended (16 weeks)</SelectItem>
                    <SelectItem value="Intensive">Intensive (8 weeks)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price Calculation - show when duration picked (and grade if required) */}
          {(hideGradeForCourse ? Boolean(duration) : Boolean(grade && duration)) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{hasFixedDurationOptions ? 'Program Price:' : 'Price:'}</span>
                <span className="font-semibold">${calculatePrice()}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-[#F16112]">${totalPrice}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={hideGradeForCourse ? !duration : (!grade || !duration)}
              className="flex-1 bg-[#F16112] hover:bg-[#d54f0a]"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCustomizationModal;









