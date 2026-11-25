


import * as HomeService from "./home.service.js";

export const getHomeData = async (req, res, next) => {
  try {
    const data = await HomeService.getHomeData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
