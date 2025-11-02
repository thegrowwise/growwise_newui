import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Plus, Minus, ShoppingCart, Calculator, Clock, Users } from "lucide-react";
import { useCart } from './gw/CartContext';

interface CourseCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onAddToCart?: (item: any) => void;
}

// Course pricing data mapping
const coursePricing = {
  'middle-school-math': {
    grades: [6, 7, 8],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'elementary-math': {
    grades: [1, 2, 3, 4, 5],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'math-course-1-2': {
    grades: [1, 2],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'math-course-3': {
    grades: [3],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'math-integrated-1': {
    grades: [1],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'math-integrated-2': {
    grades: [2],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  },
  'algebra-1': {
    grades: [1],
    pricing: { '4': 360, '12': 1080, '24': 1160 }
  },
  'algebra-2': {
    grades: [2],
    pricing: { '4': 360, '12': 1080, '24': 1160 }
  },
  // English Courses Pricing
  'reading-enrichment-k-5': {
    grades: ['K', 1, 2, 3, 4, 5],
    pricing: { '4': 216, '12': 648 }
  },
  'grammar-boost-k-8': {
    grades: ['K', 1, 2, 3, 4, 5, 6, 7, 8],
    pricing: { 
      '4': { 'K': 216, 1: 216, 2: 216, 3: 216, 4: 216, 5: 216, 6: 216, 7: 240, 8: 240 },
      '8': { 'K': 426, 1: 426, 2: 426, 3: 426, 4: 426, 5: 426, 6: 480, 7: 480, 8: 480 }
    }
  },
  'english-mastery-k-12': {
    grades: ['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    pricing: { '4': 280, '12': 840, '24': 1280 }
  }
};

const CourseCustomizationModal: React.FC<CourseCustomizationModalProps> = ({
  isOpen,
  onClose,
  course,
  onAddToCart
}) => {
  const { addItem } = useCart();
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('12');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Get course-specific data
  const courseData = coursePricing[course?.id as keyof typeof coursePricing];
  const availableGrades = courseData?.grades || [];
  const pricingData = courseData?.pricing || {};

  // Duration options
  const durationOptions = [
    { value: '4', label: '4 weeks', description: 'Intensive crash course' },
    { value: '8', label: '8 weeks', description: 'Regular program' },
    { value: '12', label: '12 weeks', description: 'Standard program' },
    { value: '24', label: '24 weeks', description: 'Comprehensive mastery' }
  ];

  // Get available durations based on the course
  const getAvailableDurations = () => {
    if (!courseData?.pricing) return durationOptions;
    
    return durationOptions.filter(option => 
      Object.keys(courseData.pricing).includes(option.value)
    );
  };

  // Get price for selected grade and duration
  const getPrice = (grade: string, duration: string) => {
    if (!courseData?.pricing) return 0;
    
    const pricingForDuration = courseData.pricing[duration as keyof typeof courseData.pricing];
    
    // Handle complex pricing like grammar-boost-k-8
    if (typeof pricingForDuration === 'object') {
      return (pricingForDuration as any)[grade] || 0;
    }
    
    // Handle simple pricing
    return pricingForDuration || 0;
  };

  // Reset form when modal opens with new course
  useEffect(() => {
    if (isOpen && course) {
      setSelectedGrade(availableGrades.length === 1 ? availableGrades[0].toString() : '');
      setSelectedDuration('12');
      setQuantity(1);
    }
  }, [isOpen, course, availableGrades]);

  // Calculate total price whenever selections change
  useEffect(() => {
    if (selectedGrade && selectedDuration) {
      const basePrice = getPrice(selectedGrade, selectedDuration);
      setTotalPrice(basePrice * quantity);
    }
  }, [selectedGrade, selectedDuration, quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    setQuantity(clampedQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedGrade || !selectedDuration) {
      return;
    }

    const basePrice = getPrice(selectedGrade, selectedDuration);
    const customizedCourse = {
      ...course,
      id: `${course.id}-grade${selectedGrade}-${selectedDuration}w`,
      name: `${course.name} (Grade ${selectedGrade})`,
      price: basePrice,
      duration: `${selectedDuration} weeks`,
      level: `Grade ${selectedGrade}`,
      customization: {
        grade: selectedGrade,
        duration: selectedDuration,
        basePrice: basePrice
      }
    };

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      if (onAddToCart) {
        onAddToCart(customizedCourse);
      } else {
        addItem(customizedCourse);
      }
    }

    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isFormValid = selectedGrade && selectedDuration;

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl rounded-[24px] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] p-6 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {course.name}
              </DialogTitle>
              <DialogDescription className="text-white/80 text-sm">
                Customize your learning experience
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Description */}
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Grade Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1F396D]" />
                Select Grade
              </Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full border-gray-300 rounded-xl h-12 focus:border-[#1F396D] focus:ring-[#1F396D]">
                  <SelectValue placeholder="Choose your grade level" />
                </SelectTrigger>
                <SelectContent>
                  {availableGrades.map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F16112]" />
                Select Program Duration
              </Label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-full border-gray-300 rounded-xl h-12 focus:border-[#F16112] focus:ring-[#F16112]">
                  <SelectValue placeholder="Choose program length" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDurations().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#F1894F]" />
                Quantity
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0 rounded-xl border-gray-300 hover:border-[#F1894F] hover:bg-[#F1894F]/10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 text-center">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4">
                    <span className="text-lg font-bold text-gray-900">{quantity}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {quantity === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 p-0 rounded-xl border-gray-300 hover:border-[#F1894F] hover:bg-[#F1894F]/10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Maximum 10 courses per order</p>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/10 rounded-xl p-4 border border-[#F16112]/20">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total Price</div>
              <div className="text-3xl font-bold text-[#1F396D] mb-2">
                {formatPrice(totalPrice)}
              </div>
              {selectedGrade && selectedDuration && (
                <div className="text-sm text-gray-500">
                  {formatPrice(getPrice(selectedGrade, selectedDuration))} × {quantity} {quantity === 1 ? 'course' : 'courses'}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!isFormValid}
              className="flex-2 h-12 bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart • {formatPrice(totalPrice)}
            </Button>
          </div>

          {/* Form Validation Message */}
          {!isFormValid && (
            <div className="text-center">
              <p className="text-sm text-red-600">
                Please select both grade level and program duration to continue
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCustomizationModal;
