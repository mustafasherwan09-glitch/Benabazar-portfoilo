import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaHeart, FaUserCircle } from 'react-icons/fa';

const feedbacks = [
    // Kurdish Customers
    { id: 1, name: 'Soran Ali', text: 'دەستتان خۆش بێت، کاڵاکانم بە دەست گەیشت زۆر جوانن 😍', lang: 'ku', type: 'received' },
    { id: 2, name: 'Rezan Ahmed', text: 'بەڕاستی خزمەتگوزاریتان نایابە، زۆر سوپاس', lang: 'ku', type: 'received' },
    { id: 3, name: 'Kardo K.', text: 'کاڵاکان زۆر باش بوون وەکو خۆی، بێگومان دیسان داوا ئەکەمەوە', lang: 'ku', type: 'received' },
    { id: 4, name: 'Shnyar Othman', text: 'زۆر ڕازیم لە مامەڵەتان، سەرکەوتوو بن ❤️', lang: 'ku', type: 'received' },
    { id: 5, name: 'Hastyar', text: 'گەیاندنەکەتان زۆر خێرا بوو، دەست خۆش', lang: 'ku', type: 'received' },
    { id: 6, name: 'Sima Mohammed', text: 'جوانترین کاڵا و باشترین نرخ، هەر بژین', lang: 'ku', type: 'received' },
    { id: 7, name: 'Lanya Jamal', text: 'سوپاس بۆ دیارییەکان، زۆر دڵخۆشم پێیان ✨', lang: 'ku', type: 'received' },
    { id: 8, name: 'Zhiwar R.', text: 'تاکە پەیج کە متمانەم پێیەتی بۆ شت کڕین', lang: 'ku', type: 'received' },

    // Arabic Customers
    { id: 9, name: 'Ahmed Saadi', text: 'وصلت الطلبية، عاشت ايدكم ع السرعة والترتيب ❤️', lang: 'ar', type: 'received' },
    { id: 10, name: 'Noor Alhuda', text: 'افضل تعامل واسعار، شكرا جزيلا', lang: 'ar', type: 'received' },
    { id: 11, name: 'Sarah K.', text: 'الاردور يجنن ونفس الصور بالضبط، ممنونة منكم', lang: 'ar', type: 'received' },
    { id: 12, name: 'Mustafa Iraq', text: 'خدمة ممتازة وتوصيل سريع، ان شاء الله مو اخر تعامل', lang: 'ar', type: 'received' },
    { id: 13, name: 'Zahra Ali', text: 'كلش حبيت الغراض، شكرا على الهدايا ويا الطلب 🎁', lang: 'ar', type: 'received' },
    { id: 14, name: 'Omer F.', text: 'ثقة وامانة، ربي يرزقكم', lang: 'ar', type: 'received' },
    { id: 15, name: 'Layla M.', text: 'تعامل راقي جدا، شكرا بنة بازار', lang: 'ar', type: 'received' }
];

const Feedbacks = () => {
    return (
        <section id="feedbacks" style={{ background: '#fafafa', padding: '5rem 0' }}>
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h2 style={{ color: 'var(--color-primary)' }}>Customer Love • ڕای کڕیاران</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>What our customers say in our DMs</p>
                </motion.div>

                {/* Masonry-style Grid - using CSS columns for simplicity or just flex wrap */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1.5rem'
                }}>
                    {feedbacks.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'white',
                                width: '300px',
                                borderRadius: '20px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                border: '1px solid #efefef',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Instagram Header Mock */}
                            <div style={{
                                padding: '10px 15px',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        background: 'white',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ccc',
                                        fontSize: '20px'
                                    }}>
                                        <FaUserCircle />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#262626' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#8e8e8e' }}>Active now</div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div style={{
                                padding: '15px',
                                background: '#fff',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {/* Message Bubble (Received) */}
                                <div style={{
                                    alignSelf: 'flex-start',
                                    maxWidth: '85%',
                                    background: '#efefef',
                                    padding: '10px 14px',
                                    borderRadius: '18px',
                                    borderBottomLeftRadius: '4px',
                                    color: '#262626',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4',
                                    fontFamily: item.lang === 'ku' || item.lang === 'ar' ? 'Tahoma, Arial' : 'inherit',
                                    direction: item.lang === 'ku' || item.lang === 'ar' ? 'rtl' : 'ltr'
                                }}>
                                    {item.text}
                                </div>

                                {/* Reply Bubble (Sent - Optional/Generic) */}
                                <div style={{
                                    alignSelf: 'flex-end',
                                    maxWidth: '85%',
                                    background: 'var(--color-primary)', // Using Primary color instead of insta blue
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '18px',
                                    borderBottomRightRadius: '4px',
                                    fontSize: '0.9rem'
                                }}>
                                    <FaHeart style={{ marginTop: '2px' }} />
                                </div>
                            </div>

                            {/* Instagram Footer Mock */}
                            <div style={{
                                padding: '10px 15px',
                                borderTop: '1px solid #f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                color: '#8e8e8e',
                                fontSize: '1.2rem'
                            }}>
                                <div style={{ fontSize: '0.8rem' }}>Message...</div>
                                <FaInstagram />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feedbacks;
