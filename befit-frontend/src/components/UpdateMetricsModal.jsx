import React, { useState, useEffect } from 'react';
import { User, Activity, Scale, Ruler, Calendar, Check, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { updateUserProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calculateBmi, getBmiCategory, getHealthyWeightRange } from '../utils/bmiCalculator';

const UpdateMetricsModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age != null ? String(user.age) : '',
        height: user.height != null ? String(user.height) : '',
        weight: user.weight != null ? String(user.weight) : '',
      });
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const previewBmi = calculateBmi(formData.weight, formData.height);
  const previewDetails = previewBmi ? getBmiCategory(previewBmi) : null;
  const healthyRange = formData.height ? getHealthyWeightRange(formData.height) : null;

  const validate = () => {
    const errs = {};
    if (formData.age) {
      const a = Number(formData.age);
      if (isNaN(a) || a < 1 || a > 130) errs.age = 'Age must be between 1 and 130';
    }
    if (formData.height) {
      const h = Number(formData.height);
      if (isNaN(h) || h < 30 || h > 300) errs.height = 'Height must be between 30 and 300 cm';
    }
    if (formData.weight) {
      const w = Number(formData.weight);
      if (isNaN(w) || w < 10 || w > 500) errs.weight = 'Weight must be between 10 and 500 kg';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        age: formData.age !== '' ? Number(formData.age) : null,
        height: formData.height !== '' ? Number(formData.height) : null,
        weight: formData.weight !== '' ? Number(formData.weight) : null,
      };

      const res = await updateUserProfile(payload);
      updateUser(res.data);
      toast.success('Body metrics & profile updated successfully!');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update body metrics.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Body Metrics & Profile" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            id="firstName"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Input
            id="age"
            label="Age (Years)"
            type="number"
            min="1"
            max="130"
            placeholder="25"
            icon={Calendar}
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
          />
          <Input
            id="height"
            label="Height (cm)"
            type="number"
            step="0.1"
            min="30"
            max="300"
            placeholder="175"
            icon={Ruler}
            value={formData.height}
            onChange={handleChange}
            error={errors.height}
          />
          <Input
            id="weight"
            label="Weight (kg)"
            type="number"
            step="0.1"
            min="10"
            max="500"
            placeholder="70"
            icon={Scale}
            value={formData.weight}
            onChange={handleChange}
            error={errors.weight}
          />
        </div>

        {/* Live Calculation Preview */}
        {previewBmi && previewDetails ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--border-radius)',
              background: previewDetails.badgeBg,
              border: `1px solid ${previewDetails.badgeBorder}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color={previewDetails.color} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Calculated BMI:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: previewDetails.color }}>
                  {previewBmi}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: previewDetails.color,
                  padding: '3px 10px',
                  borderRadius: 'var(--border-radius-pill)',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                {previewDetails.category}
              </span>
            </div>

            {healthyRange && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Healthy weight for {formData.height} cm: <strong style={{ color: 'var(--text-primary)' }}>{healthyRange.minWeight} – {healthyRange.maxWeight} kg</strong>
              </p>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--border-radius)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--border-glass)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
          >
            Enter height and weight to calculate your BMI and healthy target weight.
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="gradient" type="submit" loading={loading} icon={Check}>
            Save Body Metrics
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateMetricsModal;
