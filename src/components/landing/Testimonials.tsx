import React from "react";
import Carousel from "react-elastic-carousel";
import Content from "../Content";

import "./testimonials.less";
import TestimonialTemplate from "./TestimonialTemplate";

export default function Testimonials() {
	const mobileSlideCount = 1;
	const tabletSlideCount = 2;
	const desktopSlideCount = 2;

	return (
		<Content className="client-testimonials">
			<h2>What Users Are Saying?</h2>
			<Carousel
				itemsToShow={2}
				breakPoints={[
					{
						width: 300,
						itemsToShow: mobileSlideCount,
						itemsToScroll: mobileSlideCount,
					},
					{
						width: 577,
						itemsToShow: tabletSlideCount,
						itemsToScroll: tabletSlideCount,
					},
					{
						width: 992,
						itemsToShow: desktopSlideCount,
						itemsToScroll: desktopSlideCount,
					},
				]}
				showArrows={false}
			>
				<TestimonialTemplate
					title="Moneo has become my go-to financial coach"
					name="Nipa"
					location="Ahmedabad"
					imageLocation="images/testimonials/nipa.jpg"
					content="I had taken a home loan of Rs. 25 lakhs over 20 years. After paying installments for 7
				years, I was wondering if I should prepay the remaining loan of Rs. 17 lakhs to save interest or invest the money. By using
				Moneo's loan calculator, I was instantly able to get answers to various scenarios. It even
				allowed me to assess the impact of refinancing the loan. Finally, I decided to prepay the loan and get peace of mind. Moneo has now become my go-to coach for
				financial analysis and planning."
				/>

				<TestimonialTemplate
					title="Moneo removed my financial worries"
					name="Snehal"
					location="Bangalore"
					imageLocation="images/testimonials/snehal.jpg"
					content="After working for 30 years, I have been keen to retire. While I am not
				comfortable with financial jargon, using Moneo is a breeze. Within 15 minutes, I was able to
				define my goals and understand the money needed for early retirement. I
				also realized that I could retire within 5 years! Moneo presented detailed graphs and
				information to give me a better understanding of my financial situation and the road ahead. My
				wife and I are so relaxed about our financial situation. I highly recommend Moneo to everyone."
				/>

				<TestimonialTemplate
					title="Moneo helped me to become my own boss"
					name="Nancy"
					location="Delhi"
					imageLocation="images/testimonials/nancy.jpg"
					content="I worked in a job I hated, but stuck around for stable income. I always dreamt of starting my cosmetics business. 
					A friend suggested Moneo as I had no idea about how to manage money. It not only gave me a financial reality check, but also showed me that investing regularly is more important than just saving. 
					As I understood more about investing and the power of compounding, it helped me to overcome my fear. 
					Finally, I quit my job and became my own boss!"
				/>

				<TestimonialTemplate
					title="Moneo saved Rs. 30 lakhs"
					name="Neha"
					location="Bangalore"
					imageLocation="images/testimonials/neha.jpg"
					content="My family has been living on rent since 20 years, and my husband uses a rental car for his
				office commute. I had been trying to convince him to buy an apartment and a car since sometime,
				but he wasn't sure as it required us to spend most of our savings. This had become a hotly debated
				topic in the family. Finally, Moneo came to our rescue. Using Moneo's Buy vs Rent and Invest
				calculator, we realized that we are better off by Rs. 30 lakhs by continuing to rent the apartment and car."
				/>

				<TestimonialTemplate
					title="Moneo helped me to invest globally"
					name="Helen"
					location="Pondicherry"
					imageLocation="images/testimonials/helen.jpg"
					content="Most of my savings, across multiple currencies, was sitting idle as I found it difficult to invest myself. I also wasn't able to trust an advisor. Besides, good advisors are too expensive. 
					Moneo has been a godsent. Within 15 minutes, I got a diversified and global investment plan based on my life goals without paying a single penny! I have been able to invest globally using Moneo's sound investment process.
				I can now sleep peacefully knowing that my portfolio is safe and working 24x7 for my secure future."
				/>
			</Carousel>
		</Content>
	);
}
