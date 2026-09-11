import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import '../../styles/pages/Contact.css';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    // Simulate API call to send inquiry
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Have questions about a safari, need help with a booking, or just want to say hi? We're here for you.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info-wrapper">
          <div className="contact-info-card card">
            <h2 className="contact-info-title">Get in Touch</h2>
            
            <div className="contact-info-list">
              <div className="contact-info-item">
                <MapPin className="contact-info-icon" />
                <div>
                  <h3 className="contact-info-item-title">Office Location</h3>
                  <p className="contact-info-item-desc">123 Safari Route, Jungle Avenue<br />Nagpur, Maharashtra 440001<br />India</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <Mail className="contact-info-icon" />
                <div>
                  <h3 className="contact-info-item-title">Email Us</h3>
                  <p className="contact-info-item-desc">hello@wildconnect.in<br />support@wildconnect.in</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <Phone className="contact-info-icon" />
                <div>
                  <h3 className="contact-info-item-title">Call Us</h3>
                  <p className="contact-info-item-desc">+91 98765 43210<br />Mon-Fri, 9am to 6pm IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card card">
          <h2 className="contact-form-title">Send a Message</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div>
              <label className="contact-form-label">Your Name</label>
              <input type="text" {...register('name')} className="input-field" placeholder="John Doe" />
              {errors.name && <p className="contact-form-error">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="contact-form-label">Email Address</label>
              <input type="email" {...register('email')} className="input-field" placeholder="john@example.com" />
              {errors.email && <p className="contact-form-error">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="contact-form-label">Subject</label>
              <input type="text" {...register('subject')} className="input-field" placeholder="How can we help?" />
              {errors.subject && <p className="contact-form-error">{errors.subject.message}</p>}
            </div>
            
            <div>
              <label className="contact-form-label">Message</label>
              <textarea {...register('message')} rows={5} className="input-field" placeholder="Write your message here..."></textarea>
              {errors.message && <p className="contact-form-error">{errors.message.message}</p>}
            </div>
            
            <button type="submit" disabled={isSubmitting} className="contact-btn-submit btn-primary">
              {isSubmitting ? 'Sending...' : <><Send className="contact-btn-icon" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
