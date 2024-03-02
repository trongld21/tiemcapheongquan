import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DatePicker } from 'antd';
import dashboardAPI from '@/pages/api/manager/dashboardAPI';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const [chartOptions, setChartOptions] = useState({});
    const [dataChart, setDataChart] = useState();
    const [chooseYear, setChooseYear] = useState(new Date().getFullYear());

    const onChange = (e) => {
        setChooseYear(e.target.value);
        fetchData(e.target.value);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (year) => {
        try {
            const dataCharts = await dashboardAPI.GetDataChartByYear(year);
            if (dataCharts.success && dataCharts.data) {
                setDataChart(Object.values(dataCharts.data));
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
        }
    };
    useEffect(() => {
        setChartData({
            labels: [
                'Thg 1',
                'Thg 2',
                'Thg 3',
                'Thg 4',
                'Thg 5',
                'Thg 6',
                'Thg 7',
                'Thg 8',
                'Thg 9',
                'Thg 10',
                'Thg 11',
                'Thg 12',
            ],
            datasets: [
                {
                    label: 'Mệnh giá theo VNĐ',
                    data: dataChart,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235, 0.4',
                },
            ],
        });
        setChartOptions({
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Doanh thu hàng tháng',
                },
            },
            maintainAspectRatio: false,
            responsive: true,
        });
    }, [dataChart]);

    return (
        <>
            <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
                <input
                    type="number"
                    min="1900"
                    max="9999"
                    step="1"
                    name="year"
                    value={chooseYear}
                    onChange={(e) => onChange(e)}
                    className="rounded"
                />
                <Bar data={chartData} options={chartOptions} />
            </div>
        </>
    );
};

export default BarChart;
