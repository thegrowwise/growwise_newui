import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Plus, Minus, Calculator } from 'lucide-react';

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

  const handleAddToCart = () => {
    const cartItem = {
      id: `${course.id}-${grade}-${duration}`,
      name: `${course.name} - ${grade} - ${duration}`,
      price: calculatePrice(),
      quantity,
      image: course.image,
      category: course.category || 'Course',
      type: 'course',
      duration,
      level: grade
    };

    onAddToCart(cartItem);
    onClose();
  };

  const calculatePrice = () => {
    // Base price logic - you can customize this based on your pricing structure
    let basePrice = course.price || 100;
    
    // Add pricing modifiers based on grade and duration
    if (grade === 'High School') basePrice *= 1.2;
    if (duration === 'Extended') basePrice *= 1.5;
    
    return Math.round(basePrice);
  };

  const totalPrice = calculatePrice() * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Customize Course</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{course.description}</p>
          </div>

          {/* Grade Selection */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elementary">Elementary (K-5)</SelectItem>
                <SelectItem value="Middle School">Middle School (6-8)</SelectItem>
                <SelectItem value="High School">High School (9-12)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard (12 weeks)</SelectItem>
                <SelectItem value="Extended">Extended (16 weeks)</SelectItem>
                <SelectItem value="Intensive">Intensive (8 weeks)</SelectItem>
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

          {/* Price Calculation */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Base Price:</span>
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
              disabled={!grade || !duration}
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



