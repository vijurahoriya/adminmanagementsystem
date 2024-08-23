import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from './images/img1.png';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
// import image from './images/image.avif';
import './style/Slider.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import banner1 from './images/banner1.jpg';
import banner2 from './images/banner2.jpg';


export default function Slider() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <div>
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={banner1}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h1>Skillbharat-Online Examination System</h1>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={banner2}
                            alt="Second slide"
                        />

                        <Carousel.Caption>
                            <h2>One Stop solution for conducting Online exams</h2>
                        </Carousel.Caption>
                    </Carousel.Item>
                   
                </Carousel>

            </div>

            <h1 className='heading'>FEATURES</h1>
            <div className='cards_section'>

                <div className='card1'>
                    <Card style={{ width: '18rem', height: '29rem' }}>
                        <Card.Img variant="top" src={img1} />
                        <Card.Body>
                            <Card.Title>Simple to learn</Card.Title>
                            <Card.Text>
                                One stop solution for online examination and assessment. It would solve all your problems in preparation for the exam. The platform is effortless to use and transmit information
                            </Card.Text>
                            <Button variant="primary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>

                <div className='card2'>
                    <Card style={{ width: '18rem', height: '29rem' }}>
                        <Card.Img variant="top" src={img2} />
                        <Card.Body>
                            <Card.Title>Interactive Interface</Card.Title>
                            <Card.Text>
                            Easy registration, click away tricks, and simple test creation facilitated by online exam software. Signing in and concurring. Safe data encrypted information.
                            </Card.Text>
                            <Button variant="primary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>

                <div className='card3'>
                    <Card style={{ width: '18rem', height: '29rem' }}>
                        <Card.Img variant="top" src={img3} />
                        <Card.Body>
                            <Card.Title>Test software with Advanced Reporting System</Card.Title>
                            <Card.Text>
                            </Card.Text>
                            <Button variant="primary">Read More</Button>
                        </Card.Body>
                    </Card>
                </div>














            </div>



        </div>

    )
}
